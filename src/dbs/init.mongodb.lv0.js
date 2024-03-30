"use strict";

import mongoose from "mongoose";

const connectString = `mongodb://localhost:27017/shopDev`;

mongoose
    .connect(connectString)
    .then((_) => console.log(`Connected Mongodb Success`))
    .catch(() => console.log(`Error Connect`));

// dev
if (1 === 1) {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });
}

export default mongoose