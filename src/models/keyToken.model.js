"use strict";

import mongoose from "mongoose";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },

        publicKey: {
            type: String,
            required: true,
        },

        privateKey: {
            type: String,
            required: true,
        },

        // Dùng để tách các token trái phép của Hacker
        refreshToken: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const KeyToken = mongoose.model(DOCUMENT_NAME, keyTokenSchema);

export default KeyToken;
