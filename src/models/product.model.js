"use strict";

import mongoose from "mongoose";
import slugify from "slugify";

const COLLECTION_NAME = "products";
const DOCUMENT_NAME = "Product";

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true }, // Quan jean cao cap
        product_thumb: { type: String, required: true },
        product_description: String,
        product_slug: String, // Quan-jean-cao-cap
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
        //more
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be under 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: {
            type: Array,
            default: [],
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Create index for search
productSchema.index({ product_name: "text", product_description: "text" });
// Document middleware: runs before .save() and create(), ...
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// define the product type = clothing
const clothingSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
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
        product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        timestamps: true,
        collection: "electronics",
    }
);

// define the product type = furniture
const furnitureSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        timestamps: true,
        collection: "furniture",
    }
);

const _ProductModel = mongoose.model(DOCUMENT_NAME, productSchema);
const _ClothingModel = mongoose.model("Clothing", clothingSchema);
const _ElectronicModel = mongoose.model("Electronic", electronicSchema);
const _FurnitureModel = mongoose.model("Furniture", furnitureSchema);

export { _ProductModel, _ClothingModel, _ElectronicModel, _FurnitureModel };
