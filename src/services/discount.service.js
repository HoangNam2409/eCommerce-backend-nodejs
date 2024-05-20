"use strict";

/*
    Discount Service

    1. Generator Discount Code [Shop | Admin]
    2. Get Discount Amount [User]
    3. Get all discount codes [User | Shop]
    4. Verify discount code [user]
    5. Delete discount code [shop | admin]
    6. Cancel discount code [user]
*/

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import _DiscountModel from "../models/discount.model.js";
import { findAllProducts } from "../models/repositories/product.repo.js";
import {
    checkDiscount,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
} from "../models/repositories/discount.repo.js";
import { convertToObjectIdMongodb } from "../utils/index.js";

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            name,
            description,
            code,
            start_date,
            end_date,
            type,
            value,
            min_order_value,
            max_uses,
            uses_count,
            users_used,
            max_uses_per_user,
            shopId,
            is_active,
            applies_to,
            product_ids,
        } = payload;

        // Kiem tra payload
        if (
            new Date() > new Date(start_date) ||
            new Date() > new Date(end_date)
        ) {
            throw new BadRequestError("Discount code has expired!");
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date!");
        }

        // Create index for discount code
        const foundDiscount = await checkDiscount({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: _DiscountModel,
        });

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists!");
        }

        const newDiscount = await _DiscountModel.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_type: type,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        });

        if (!newDiscount) {
            throw new BadRequestError("New Discount Create Error");
        }

        return newDiscount;
    }

    static async updateDiscountCode({ discountId, payload }) {
        return await _DiscountModel.findByIdAndUpdate(discountId, payload, {
            new: true,
        });
    }

    // Get list products by discount_code
    static async getAllDiscountCodesWithProduct({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        // Create index for discount_code
        const foundDiscount = await checkDiscount({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: _DiscountModel,
        });

        if (!foundDiscount && !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount not exists!");
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;

        if (discount_applies_to === "all") {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                sort: "ctime",
                limit: +limit,
                page: +page,
                select: ["product_name"],
            });
        }

        if (discount_applies_to === "specific") {
            // Get products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name", "product_price", "product_quantity"],
            });
        }

        return products;
    }

    // Get list discount_code by shopId
    static async getAllDiscountCodeByShopId({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodesUnSelect({
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            limit: +limit,
            page: +page,
            unSelect: ["__v", "discount_shopId"],
            model: _DiscountModel,
        });

        return discounts;
    }

    /*
        Get discount_code amount

        Products = {
            productId,
            shopId,
            quantity,
            price,
            name
        }
    */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscount({
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: _DiscountModel,
        });

        if (!foundDiscount) {
            throw new NotFoundError("Discount not exists!");
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_type,
            discount_value,
            discount_start_date,
            discount_end_date,
        } = foundDiscount;

        if (!discount_is_active) {
            throw new NotFoundError("Discount expired!");
        }
        if (!discount_max_uses) {
            throw new NotFoundError("Discount are out!");
        }
        if (
            new Date() > new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new NotFoundError("Discount code has expired!");
        }

        // Check xem co xet gia tri toi thieu hay khong
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(
                    `Discount require a minium order value of ${discount_min_order_value}!`
                );
            }
        }

        /*
            discount_max_uses_per_user = 2
        */

        const amount =
            discount_type === "fixed_amount"
                ? discount_value
                : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    // Delete discount_code
    static async deleteDiscountCode({ codeId, shopId }) {
        const deleted = await _DiscountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });

        return deleted;
    }

    // Cancel discount code by user
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscount({
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: _DiscountModel,
        });

        if (!foundDiscount) {
            throw new NotFoundError(`Discount doesn't exists`);
        }

        const result = await _DiscountModel.findByIdAndUpdate(
            foundDiscount._id,
            {
                $pull: {
                    discount_users_used: userId,
                },

                $inc: {
                    discount_max_uses: 1,
                    discount_uses_count: -1,
                },
            }
        );

        return result;
    }
}

export default DiscountService;
