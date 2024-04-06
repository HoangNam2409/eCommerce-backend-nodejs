"use strict";

import { CREATE, SuccessResponse } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
    // Handler refreshToken
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Get token successfully!",
            metadata: await AccessService.handlerRefreshToken(
                req.body.refreshToken
            ),
        }).send(res);
    };

    // LOGOUT
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout successfully!",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    // LOGIN
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    // SIGN UP
    signUp = async (req, res, next) => {
        new CREATE({
            message: "Create Successfully!",
            metadata: await AccessService.signUp(req.body),
        }).send(res);
        // return res.status(201).json(await AccessService.signUp(req.body));
    };
}

const accessController = new AccessController();

export default accessController;
