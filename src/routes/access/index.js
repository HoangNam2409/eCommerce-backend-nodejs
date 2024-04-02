"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";

const route = express.Router();

// Sign up
route.post("/shop/signup", accessController.signUp);

export default route;
