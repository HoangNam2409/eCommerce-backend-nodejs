"use strict";

import bcrypt from "bcrypt";
import crypto from "crypto";

import Shop from "../models/shop.model.js";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";
import { AuthFailureError, BadRequestError } from "../core/error.response.js";
import { findByEmail } from "./shop.service.js";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
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

        // 4. Generate token
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );

        // Save publicKey and privateKey in collection
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
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
        const holderShop = await Shop.findByEmail({ email }).lean();

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
