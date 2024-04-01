"use strict";

import bcrypt from "bcrypt";
import crypto from "crypto";

import Shop from "../models/shop.model.js";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // Step 1: Check email exists?
            const holderShop = await Shop.findOne({ email }).lean();

            if (holderShop) {
                return {
                    code: "xxx",
                    message: "Shop already registered",
                };
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
                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                console.log({ privateKey, publicKey }); 

                // save collection KeyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });

                if (!keyStore) {
                    return {
                        code: "xxx",
                        message: "keyStore Error",
                    };
                }

                // Create token pair
                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKey,
                    privateKey
                );
                console.log(`Created Token Success:: `, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        tokens,
                    },
                };
            }

            return {
                code: 200,
                metadata: null,
            };
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}

export default AccessService;
