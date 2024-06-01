"use strict";

import express from "express";
import { authenticationV2 } from "../../auth/authUtils";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import inventoryController from "../../controllers/inventory.controller.js";

const router = express.Router();

router.use(authenticationV2);
router.post("", asyncHandler(inventoryController.addStockToInventory));

export default router;
