"use strict";

import mongoose from "mongoose";

const COLLECTION_NAME = "inventories";
const DOCUMENT_NAME = "Inventory";

const inventorySchema = new mongoose.Schema(
    {
        inven_productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        inven_location: { type: String, default: "unKnow" },
        inven_stock: { type: Number, required: true },
        inven_shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
        },
        inven_reservation: { type: Array, default: [] },
        /* 
        cartId:,
        stock: 1,
        createdOn:
    */
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const _InventoryModel = mongoose.model(DOCUMENT_NAME, inventorySchema);

export default _InventoryModel;
