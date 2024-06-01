"use strict";

import mongoose from "mongoose";

const COLLECTION_NAME = "order";
const DOCUMENT_NAME = "Order";

const orderSchema = new mongoose.Schema(
    {
        order_userId: { type: Number, required: true },
        order_checkout: { type: Object, default: {} },
        /*
            order_checkout: {
                totalPrice,
                totalApplyDiscount,
                feeShip,
            }
        */
        order_shipping: { type: Object, default: {} },
        /*
            order_shipping: {
                street,
                city,
                state,
                con
            }
        */
        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true },
        order_trackingNumber: { type: String, default: "#000101062024" },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "cancel", "delivered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const _OrderModel = mongoose.model(DOCUMENT_NAME, orderSchema);
export default _OrderModel;
