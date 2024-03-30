"use strict";

import mongoose from "mongoose";
import dotenv from "dotenv";

import { countConnect } from "../helpers/check.connect.js";
import { config } from "../configs/config.mongodb.js";

// Config dotenv
dotenv.config()

const env = process.env.NODE_ENV || 'dev'
const {
    db: { host, port, name },
} = config[env];
const connectString = `mongodb://${host}:${port}/${name}`;

console.log(`connectString::: ${connectString}`)
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
