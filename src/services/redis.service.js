"use strict";

import redis from "redis";
import { promisify } from "util"; // Dùng để chuyển đổi một hàm thành một hàm async/await
import { reservationInventory } from "../models/repositories/inventory.rep.js";
const redisClient = redis.createClient(); // Tạo một Server

// Tạo ra một file async/await
const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// Nếu nó tồn tại thì set = 1, không tồn tại thì set = 0
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

/* 
    Viết một hàm lock 
    - Nhiệm vụ của acquire lock là khi người này đang thanh toán thì nó giữ lại không cho người 
    khác thanh toán nữa. Nếu mà người khác vào thì nó sẽ thử 10 lần 
*/
const acquireLock = async (productId, quantity, cartId) => {
    // key để khoá
    const key = `lock_v2024_${productId}`;
    // Nếu chưa lấy được key thì phải chờ, thì chúng ta cho phép chờ bao nhiêu lần
    const retryTimes = 10;
    // Thời gian lock
    const expireTime = 3000; // 3 seconds

    for (let i = 0; i < retryTimes.length; i++) {
        // Tạo một key, thằng nào nắm được key sẽ vào thanh toán
        const result = await setnxAsync(key, expireTime);
        console.log(`result:::::`, result);
        if (result === 1) {
            // Thao tác với inventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.modifiedCount) {
                // Đặt key này hết hạn trong vòng 3s
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

// Giải phóng key
const releaseLock = async (keyLock) => {
    const delAsynckey = promisify(redisClient.del).bind(redisClient);
    return await delAsynckey(keyLock);
};

export { acquireLock, releaseLock };
