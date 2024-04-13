"use strict";

import { AuthFailureError } from "../core/error.response.js";
import { verifyJWT } from "./authUtils.js";

const checkRefreshToken = (userId, keyStore, refreshToken) => {
    const decoded = verifyJWT(refreshToken, keyStore.privateKey);

    if (!decoded) {
        throw new AuthFailureError("Shop not registered or login");
    }

    if (decoded.userId !== userId) {
        throw new AuthFailureError("Invalid UserId refresh");
    }

    return decoded;
};

export default checkRefreshToken;
