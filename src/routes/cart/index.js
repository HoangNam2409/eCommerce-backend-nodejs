"use strict";

import express from "express";

import cartController from "../../controllers/cart.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = express.Router();

router.use(authenticationV2);

router.post("", asyncHandler(cartController.addToCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.delete("", asyncHandler(cartController.deleteCartItem));
router.get("", asyncHandler(cartController.getListUserCart));

export default router;
