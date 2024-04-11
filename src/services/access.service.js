"use strict";

import bcrypt from "bcrypt";
import crypto from "crypto";

import Shop from "../models/shop.model.js";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair, verifyJWT } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";
import {
    AuthFailureError,
    BadRequestError,
    ForbiddenError,
} from "../core/error.response.js";
import { findByEmail } from "./shop.service.js";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    // Handler Refresh Token
    // Check this token used?
    static handlerRefreshToken = async (refreshToken) => {
        // Check xem token này đã được sử dụng chưa?
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(
            refreshToken
        );

        // Nếu có
        if (foundToken) {
            // decode xem là ai
            const { userId, email } = await verifyJWT(
                refreshToken,
                foundToken.privateKey
            );
            console.log({ userId, email });

            // Xoá tất cả token trong KeyStore
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError(
                "Something wrong happened!! Please re login"
            );
        }

        // Nếu chưa có
        const holderToken = await KeyTokenService.findByRefreshToken(
            refreshToken
        );
        if (!holderToken) throw new AuthFailureError("Shop not registered!1");

        // Nếu tìm được thì verify token
        const { userId, email } = await verifyJWT(
            refreshToken,
            holderToken.privateKey
        );
        console.log("[2]---", { userId, email });
        // Check userId
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered!2");

        // Create new token
        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        );
        // Update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, // Đã được sử dụng để lấy token mới rồi
            },
        });

        return {
            user: { userId, email },
            tokens,
        };
    };

    // LOGOUT
    // Delete KeyStore
    static logout = async (keyStore) => {
        return await KeyTokenService.deleteKeyById(keyStore._id);
    };

    // LOGIN
    /*
        1 - Check email in dbs
        2 - Match password
        3 - Create Access Token and Refresh Token and Save
        4 - Generate Tokens
        5 - Get data and return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1.
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError("Shop not registered!");
        }

        // 2.
        const isMatch = bcrypt.compare(password, foundShop.password);
        if (!isMatch) {
            throw new AuthFailureError("Authentication Error");
        }

        // 3.
        // Create publicKey and privateKey
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const { _id: userId } = foundShop;

        // 4. Generate token
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        );

        // Save publicKey and privateKey in collection
        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };

    // SIGN UP
    static signUp = async ({ name, email, password }) => {
        // try {
        // Step 1: Check email exists?
        const holderShop = await findByEmail({ email });

        if (holderShop) {
            throw new BadRequestError("Error: Shop already registered");
        }

        // Hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new Shop
        const newShop = await Shop.create({
            name,
            email,
            password: hashedPassword,
            roles: [RoleShop.SHOP],
        });

        if (newShop) {
            // Created privateKey, publicKey
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");

            console.log({ privateKey, publicKey });

            // save collection KeyStore
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                throw new BadRequestError("Error: KeyStore Error");
                // return {
                //     code: "xxx",
                //     message: "keyStore Error",
                // };
            }

            // Create token pair
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );
            console.log(`Created Token Success:: `, tokens);

            return {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }

        return {
            code: 200,
            metadata: null,
        };
        // } catch (error) {
        //     return {
        //         code: "xxx",
        //         message: error.message,
        //         status: "error",
        //     };
        // }
    };
}

export default AccessService;
