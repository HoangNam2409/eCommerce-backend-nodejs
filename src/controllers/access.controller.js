"use strict";

import { CREATE } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
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
