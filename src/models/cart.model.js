"use strict";

import mongoose from "mongoose";

const COLLECTION_NAME = "carts";
const DOCUMENT_NAME = "Cart";

const cartSchema = new mongoose.Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "pending", "failed"],
            default: "active",
        },

        cart_products: { type: Array, required: true, default: [] },

        /*
            [
                {
                    productId,
                    shopId,
                    quantity,
                    name,
                    price
                }
            ]
        */

        cart_count_products: { type: Number, default: 0 },
        cart_userId: { type: Number, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const _CartModel = mongoose.model(DOCUMENT_NAME, cartSchema);
export default _CartModel;
