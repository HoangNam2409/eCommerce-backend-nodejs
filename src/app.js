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
app.use((req, res, next) => {
    const error = new Error("Not Found!");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Interval Server Error",
    });
});

export default app;
