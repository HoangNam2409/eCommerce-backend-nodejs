"use strict";

import mongoose from "mongoose";

import { countConnect } from "../helpers/check.connect.js";
import { config } from "../configs/config.mongodb.js";
import { env } from "../configs/config.environment.js";

const NODE_ENV = env.NODE_ENV || "dev";
const {
    db: { host, port, name },
} = config[NODE_ENV];
const connectString = `mongodb://${host}:${port}/${name}`;

console.log(`connectString::: ${connectString}`);
class Database {
    constructor() {
        this.connect();
    }

    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then((_) => {
                console.log(`Connected Mongodb Success`);
                countConnect();
            })
            .catch((err) => console.log(`Error Connect`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database;
export default instanceMongodb;
