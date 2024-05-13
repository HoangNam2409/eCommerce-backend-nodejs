"use strict";

import mongoose from "mongoose";

const COLLECTION_NAME = "discounts";
const DOCUMENT_NAME = "Discount";

const discountSchema = new mongoose.Schema(
    {
        // Thong tin co ban
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_code: { type: String, required: true },
        discount_start_date: { type: Date, required: true },
        discount_end_date: { type: Date, required: true },

        // Thiet lap ma giam gia
        discount_type: { type: String, default: "fixed_amount" }, // Or percentage
        discount_value: { type: Number, required: true }, // 10,000 VND or 10%
        discount_min_order_value: { type: Number, required: true }, // So luong gia tri don hang toi thieu
        discount_max_uses: { type: Number, required: true }, // So luong discount duoc su dung
        discount_uses_count: { type: Number, required: true }, // so luong discount da duoc su dung
        discount_users_used: { type: Array, default: [] }, // Ai da su dung
        discount_max_uses_per_user: { type: Number, required: true }, // luot su dung toi da cho moi nguoi
        discount_shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },

        // Hien thi ma giam gia va cac san pham ung dung
        discount_is_active: { type: Boolean, default: true },
        discount_applies_to: {
            type: String,
            required: true,
            enum: ["all", "specific"],
        },
        discount_product_ids: { type: Array, default: [] },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const _DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema);

export default _DiscountModel;
