"use strict";

import express from "express";

import accessRoutes from "./access/index.js";
import productRoutes from "./product/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";

const router = express.Router();

// check ApiKey
router.use(apiKey);

// check Permission
router.use(permission("0000"));

router.use("/v1/api", accessRoutes);
router.use("/v1/api/product", productRoutes);

export default router;
