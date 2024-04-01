import express from "express";
import "dotenv/config";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import instanceMongodb from "./dbs/init.mongodb.js";
import { checkOverload } from "./helpers/check.connect.js";
import routes from "./routes/index.js";

const app = express();

// init  middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
instanceMongodb.getInstance();
checkOverload();

// init router
app.use("/", routes);

// handling error

export default app;
