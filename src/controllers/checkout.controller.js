"use strict";

import { SuccessResponse } from "../core/success.response.js";
import CheckoutService from "../services/checkout.service.js";

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout review successfully",
            metadata: await CheckoutService.checkoutReview(req.body),
        }).send(res);
    };
}

const checkoutController = new CheckoutController();
export default checkoutController;
