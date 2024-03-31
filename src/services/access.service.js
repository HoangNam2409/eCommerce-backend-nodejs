"use strict";

import bcrypt from "bcrypt";
import Shop from "../models/shop.model.js";
import crypto from "crypto";

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
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4096,
                    }
                );

                console.log({ privateKey, publicKey }); // save collection KeyStore
            }
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
