"use strict";

import { BadRequestError } from "../../core/error.response.js";

const createUserCart = async ({ userId, product, model }) => {
    const query = { cart_userId: userId, cart_state: "active" },
        updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        },
        options = {
            upsert: true,
            new: true,
        };

    return await model.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product, model }) => {
    const { productId, quantity } = product;

    const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: "active",
        },
        updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity, // $ đại diện update chính phần tử đó
            },
        },
        options = {
            upsert: true,
            new: true,
        };

    return await model.findOneAndUpdate(query, updateSet, options);
};

const deleteUserCartItem = async ({ userId, productId, model }) => {
    const query = { cart_userId: userId, cart_state: "active" },
        updateSet = { $pull: { cart_products: { productId } } };

    return await model.updateOne(query, updateSet);
};

const getListUserCart = async ({ userId, model }) => {
    return await model.findOne({ cart_userId: +userId }).lean();
};

export {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCartItem,
    getListUserCart,
};
