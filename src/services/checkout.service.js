"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { findCartById } from "../models/repositories/cart.repo.js";
import { checkProductByServer } from "../models/repositories/product.repo.js";
// import { acquireLock, releaseLock } from "./redis.service.js";
import DiscountService from "./discount.service.js";
import _OrderModel from "../models/order.model.js";

class CheckoutService {
    // Login and without login
    /*
    Check out review 
    PAYLOAD: 
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products:[{
                        price,
                        quantity,
                        productId
                    }]
                },

                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products:[{
                        price,
                        quantity,
                        productId
                    }]
                }
            ]
        }
    */

    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
        // Kiểm tra cartId có tồn tại không
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new NotFoundError("Cart not exists");

        const checkout_order = {
                totalPrice: 0, // Tổng tiền hàng
                feeShip: 0, // Phí vận chuyển
                totalDiscount: 0, // Tổng cộng voucher giảm giá
                totalCheckout: 0, // Tổng thanh toán
            },
            shop_order_ids_new = [];

        // Tính tổng tiền bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId,
                shop_discounts = [],
                item_products = [],
            } = shop_order_ids[i];

            // Kiểm tra product có hợp lệ không
            const checkProductServer = await checkProductByServer(
                item_products
            );
            if (!checkProductServer[0])
                throw new BadRequestError("Order wrong!!!");

            // Kiểm tra tổng tiền hàng của đơn hàng
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            // Tổng tiền trước khi xử lý
            checkout_order.totalPrice += checkoutPrice;

            // Tạo itemCheckout mới để push vào shop_order_ids_new
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // Tổng giá trị trước khi giảm giá
                priceApplyDiscount: checkoutPrice, // Tổng giá trị sau khi giảm giá
                item_products: checkProductServer,
            };

            // Nếu shop_discounts tồn tại > 0, Kiểm tra xem có hợp lệ hay không
            if (shop_discounts.length > 0) {
                // Giả sử chỉ có một discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } =
                    await DiscountService.getDiscountAmount({
                        codeId: shop_discounts[0].codeId,
                        userId,
                        shopId,
                        products: checkProductServer,
                    });

                // Tổng cộng discount giảm giá
                checkout_order.totalDiscount += discount;

                // Nếu tiền giảm giá lớn hơn 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            // Tổng thanh toán cuối cùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        };
    }

    // Order by User
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {},
    }) {
        // Kiểm tra shop_order_ids
        const { shop_order_ids_new, checkout_order } =
            await CheckoutService.checkoutReview({
                cartId,
                userId,
                shop_order_ids,
            });

        // Kiểm tra một lần nữa xem có vượt tồn kho hay không
        // get new array Products
        const products = shop_order_ids_new.flatMap(
            (order) => order.item_products
        );
        const acquireProduct = [];

        // Sử dụng khoá lạc quan (Optimistic Locks)
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        // Kiểm tra nếu có một sản phẩm hết hàng trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError(
                "Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng..."
            );
        }

        const newOrder = await _OrderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        });

        // Nếu insert thành công thì remove product có trong cart
        if (newOrder) {
            // remove product in my cart
        }

        return newOrder;
    }

    /*
        1) Query Orders [USERS]
    */

    // static async getOrdersByUser() {}

    /*
        2) Query Order using id [USERS]
    */

    // static async getOneOrderByUser() {}

    /*
        3) Cancel Orders [USERS]
    */

    // static async cancelOrderByUser() {}

    /*
        4) Update Order status [Shop | Admin]
    */

    // static async updateOrderStatusByShop() {}
}

export default CheckoutService;
