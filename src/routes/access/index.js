"use strict";

import express from "express";

import accessController from "../../controllers/access.controller.js";
import { asyncHandleError } from "../../auth/checkAuth.js";

const route = express.Router();

// Sign up
route.post("/shop/signup", asyncHandleError(accessController.signUp));

export default route;
