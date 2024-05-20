"use strict";

import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import discountController from "../../controllers/discount.controller.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = express.Router();

// amount
router.post("/amount", asyncHandler(discountController.getAmountDiscountCode));
router.get(
    "/list_products_by_discount",
    asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

// Authentication
router.use(authenticationV2);
router.patch(
    "/update/:discountId",
    asyncHandler(discountController.updateDiscountCode)
);
router.post("/amount", asyncHandler(discountController.getAmountDiscountCode));
router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCode));

export default router;
