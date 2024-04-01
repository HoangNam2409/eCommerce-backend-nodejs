"use strict";

import jwt from "jsonwebtoken";

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Access Token
        const accessToken = jwt.sign(payload, publicKey, {
            expiresIn: "2 days",
        });

        // Refresh Token
        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        // Verify Token with publicKey
        jwt.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`error verify:: `, err);
            } else {
                console.log(`Decoded:: `, decoded);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};

export { createTokenPair };
