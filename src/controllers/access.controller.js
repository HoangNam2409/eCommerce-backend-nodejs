"use strict";

import { CREATE, SuccessResponse } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
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
