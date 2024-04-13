"use strict";

import mongoose from "mongoose";
import { Types } from "mongoose";

import KeyToken from "../models/keyToken.model.js";

// Create KeyToken Model
class KeyTokenService {
    // Create keyToken
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // level 0
            // const tokens = await KeyToken.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });

            // return tokens ? tokens.publicKey : null;

            // level xxx
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshToken,
                    refreshTokensUsed: [],
                },
                options = { upsert: true, new: true };
            const tokens = await KeyToken.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    // Static FindByUserId
    static findByUserId = async (userId) => {
        return await KeyToken.findOne({
            user: new mongoose.Types.ObjectId(userId),
        });
    };

    // Delete KeyToken
    static deleteKeyById = async (id) => {
        return await KeyToken.deleteOne(id);
    };

    // Find refreshTokenUsed
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyToken.findOne({
            refreshTokensUsed: refreshToken,
        }).lean();
    };

    // Delete Key Token
    static deleteKeyByUserId = async (userId) => {
        return await KeyToken.findOneAndDelete({
            user: new mongoose.Types.ObjectId(userId),
        });
    };

    // Find refresh Token
    static findByRefreshToken = async (refreshToken) => {
        return await KeyToken.findOne({ refreshToken });
    };
}

export default KeyTokenService;
