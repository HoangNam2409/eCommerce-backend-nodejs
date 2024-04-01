"use strict";

import KeyToken from "../models/keyToken.model.js";

// Create KeyToken Model
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await KeyToken.create({
                user: userId,
                publicKey,
                privateKey,
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

export default KeyTokenService;
