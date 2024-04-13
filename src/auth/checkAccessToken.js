"use strict";

import { AuthFailureError } from "../core/error.response.js";
import { verifyJWT } from "./authUtils.js";

const checkAccessToken = (userId, keyStore, accessToken) => {
    const decoded = verifyJWT(accessToken, keyStore.publicKey);

    if (!decoded) {
        throw new AuthFailureError("Shop not registered or login");
    }

    if (!decoded.userId !== userId) {
        throw new AuthFailureError("Invalid userId access");
    }

    return decoded;
};

export default checkAccessToken;
