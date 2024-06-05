"use strict";

import redis from "redis";
import { RedisErrorResponse } from "../core/error.response.js";

// Create a new client redis
// const client = redis.createClient({
//     host,
//     port,
//     username,
//     password,
// });

// client.on("error", (err) => console.error("Redis error: " + err));

let client = {},
    statusConnectRedis = {
        CONNECT: "connect",
        END: "end",
        RECONNECT: "reconnecting",
        ERROR: "error",
    },
    connectionsTimeout;

const REDIS_CONNECT_TIMEOUT = 10000,
    REDIS_CONNECT_MESSAGE = {
        code: -99,
        message: {
            vn: "Lỗi kết nối redis",
            en: "Server Connection Error",
        },
    };

const handleTimeoutError = () => {
    connectionsTimeout = setTimeout(() => {
        throw new RedisErrorResponse(
            REDIS_CONNECT_MESSAGE.message.en,
            REDIS_CONNECT_MESSAGE.code
        );
    }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
    // Check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionRedis - Connection status: Connected `);
        clearTimeout(connectionsTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: Disconnected `);
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: Reconnecting `);
        clearTimeout(connectionsTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: ${err} `);
        // connect retry
        handleTimeoutError();
    });
};

const initRedis = () => {
    const instanceRedis = redis.createClient();
    instanceRedis.connect();
    client.instanceConnect = instanceRedis;
    handleEventConnection({
        connectionRedis: instanceRedis,
    });
};

const getRedis = () => client;

const closeRedis = () => {};

export { initRedis, getRedis, closeRedis };
