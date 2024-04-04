"use strict";

import ApiKeyService from "../services/apiKey.service.js";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

// Middleware ApiKey
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();

        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }

        //Check object Key
        const objKey = await ApiKeyService.findById(key);

        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }

        req.objKey = objKey;
        return next();
    } catch (error) {}
};

// Middleware permissions
// Use closure to use an external variable called permission
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied",
            });
        }

        console.log("Permissions::: ", req.objKey.permissions);

        const isValidPermission = req.objKey.permissions.includes(permission);

        if (!isValidPermission) {
            return res.status(403).json({
                message: "Permission Denied",
            });
        }

        return next();
    };
};

export { apiKey, permission };
