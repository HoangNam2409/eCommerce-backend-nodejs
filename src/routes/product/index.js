"use strict";

import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
import productController from "../../controllers/product.controller.js";

const router = express.Router();

router.get(
    "/search/:keySearch",
    asyncHandler(productController.getListSearchProducts)
);

// Authentication //
router.use(authentication);
// create Product
router.post("", asyncHandler(productController.createProduct));
router.post(
    "/publish/:id",
    asyncHandler(productController.publishProductByShop)
);
router.post(
    "/unpublish/:id",
    asyncHandler(productController.unPublishProductByShop)
);
// Get All Drafts For Shop
// Query //
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishForShop)
);

export default router;
