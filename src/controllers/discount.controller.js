"use strict";

import DiscountService from "../services/discount.service.js";
import { SuccessResponse } from "../core/success.response.js";

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Create Discount Code successfully",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    updateDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Update Discount Code successfully",
            metadata: await DiscountService.updateDiscountCode({
                discountId: req.params.discountId,
                payload: req.body,
            }),
        }).send(res);
    };

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get All Discount code with product successfully",
            metadata: await DiscountService.getAllDiscountCodesWithProduct(
                req.query
            ),
        }).send(res);
    };

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Get All Discount Code successfully",
            metadata: await DiscountService.getAllDiscountCodeByShopId({
                shopId: req.user.userId,
                ...req.query,
            }),
        }).send(res);
    };

    getAmountDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Amount Discount Code successfully",
            metadata: await DiscountService.getDiscountAmount(req.body),
        }).send(res);
    };
}

const discountController = new DiscountController();
export default discountController;
