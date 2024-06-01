"use strict";

import express from "express";

import accessRoutes from "./access/index.js";
import productRoutes from "./product/index.js";
import discountRoutes from "./discount/index.js";
import cartRoutes from "./cart/index.js";
import checkoutRoutes from "./checkout/index.js";
import inventoryRoutes from "./inventory/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";

const router = express.Router();

// check ApiKey
router.use(apiKey);

// check Permission
router.use(permission("0000"));

router.use("/v1/api/inventory", inventoryRoutes);
router.use("/v1/api/checkout", checkoutRoutes);
router.use("/v1/api/product", productRoutes);
router.use("/v1/api/discount", discountRoutes);
router.use("/v1/api/cart", cartRoutes);
router.use("/v1/api", accessRoutes);

export default router;
