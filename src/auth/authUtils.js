"use strict";

import jwt from "jsonwebtoken";

import { asyncHandler } from "../helpers/asyncHandler.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.service.js";

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
};

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

// Authentication
const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing
        2 - get accessToken
        3 - verifyToken
        4 - check user in dbs
        5 - check keyStore with this userId?
        6 - Ok all => return next()
    */

    // Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new BadRequestError("Invalid Request");

    // check keyStore
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found KeyStore");

    // get accessToken
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new BadRequestError("Invalid Request");

    try {
        // verifyToken
        const decodedUser = jwt.verify(accessToken, keyStore.publicKey);
        // check userId in dbs
        if (decodedUser.userId !== userId)
            throw new AuthFailureError("Invalid userId");
        req.keyStore = keyStore;

        // Ok all => return next()
        return next();
    } catch (error) {
        throw error;
    }
});

export { createTokenPair, authentication };
