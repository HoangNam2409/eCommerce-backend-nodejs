"use strict";

import jwt, { decode } from "jsonwebtoken";

import { asyncHandler } from "../helpers/asyncHandler.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.service.js";
import checkAccessToken from "./checkAccessToken.js";
import checkRefreshToken from "./checkRefreshToken.js";

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESH_TOKEN: "x-rtoken-id",
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
        req.user = decodedUser;

        // Ok all => return next()
        return next();
    } catch (error) {
        throw error;
    }
});

// Authentication Version 2
const authenticationV2 = asyncHandler(async (req, res, next) => {
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

    // get refreshToken and Check refresh token header
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            // Get refreshToken header
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            // check RefreshToken
            const decoded = checkRefreshToken(userId, keyStore, refreshToken);
            // const decoded = jwt.verify(refreshToken, keyStore.privateKey);

            req.keyStore = keyStore;
            req.user = decoded;
            req.refreshToken = refreshToken;

            // Ok all => return next()
            return next();
        } catch (error) {
            throw error;
        }
    }

    // get accessToken
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new BadRequestError("Invalid Request");

    try {
        // Check AccessToken
        const decoded = checkAccessToken(userId, keyStore, accessToken);

        req.keyStore = keyStore;
        req.user = decoded;

        // Ok all => return next()
        return next();
    } catch (error) {
        throw error;
    }
});

// Verify Token
const verifyJWT = (token, keySecret) => {
    return jwt.verify(token, keySecret);
};

export { createTokenPair, authentication, authenticationV2, verifyJWT };
