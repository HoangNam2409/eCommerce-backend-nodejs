"use strict";

import express from "express";

import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";

const router = express.Router();

// Login
router.post("/shop/login", asyncHandler(accessController.login));
// Sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));

// Authentication //
router.use(authentication);
// Logout
router.post("/shop/logout", asyncHandler(accessController.logout));

export default router;
