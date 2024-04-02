"use strict";

import mongoose from "mongoose";

const COLLECTION_NAME = "ApiKeys";
const DOCUMENT_NAME = "ApiKey";

const apiKeySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },

        status: {
            type: Boolean,
            default: true,
        },

        permissions: {
            type: [String],
            enum: ["0000", "1111", "2222"],
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const ApiKey = mongoose.model(DOCUMENT_NAME, apiKeySchema);
export default ApiKey;
