import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import instanceMongodb from "./dbs/init.mongodb.js";
import { checkOverload } from "./helpers/check.connect.js";

const app = express();
dotenv.config();

// init  middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
instanceMongodb.getInstance();
checkOverload();

// init router

// handling error

export default app;
