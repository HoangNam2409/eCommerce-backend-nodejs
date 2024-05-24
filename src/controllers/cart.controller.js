"use strict";

import CartService from "../services/cart.service.js";
import { SuccessResponse } from "../core/success.response.js";

class CartController {
    // - Add product to cart [USER]
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Create Cart successfully",
            metadata: await CartService.addToCart(req.body),
        }).send(res);
    };

    // - Update cart [USER]
    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Update Cart successfully",
            metadata: await CartService.addToCartV2(req.body),
        }).send(res);
    };

    // - Delete cart [USER]
    deleteCartItem = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete Cart successfully",
            metadata: await CartService.deleteUserCartItem(req.body),
        }).send(res);
    };

    // - Get list user cart [USER]
    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list user cart successfully",
            metadata: await CartService.getListUserCart(req.query),
        }).send(res);
    };
}

const cartController = new CartController();

export default cartController;
