"use strict";

import mongoose from "mongoose";

const COLLECTION_NAME = "products";
const DOCUMENT_NAME = "Product";

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: String,
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// define the product type = clothing
const clothingSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: "clothes",
    }
);

// define the product type = electronic
const electronicSchema = new mongoose.Schema(
    {
        manufacturer: { type: String, required: true },
        model: String,
        color: String,
    },
    {
        timestamps: true,
        collection: "electronics",
    }
);

const _ProductModel = mongoose.model(DOCUMENT_NAME, productSchema);
const _ClothingModel = mongoose.model("Clothing", clothingSchema);
const _ElectronicModel = mongoose.model("Electronic", electronicSchema);

export { _ProductModel, _ClothingModel, _ElectronicModel };
