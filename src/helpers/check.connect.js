"use strict";

import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000;

// Count Connect
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections:: ${numConnections}`);
};

// Check over load connect
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`)
        console.log(`Memory usage:: ${memoryUsage / (1024 * 1024)} MB`)

        if(numConnections > maxConnections) {
            console.log(`Connection overload detected!`)
            // Notify send('...');
        }

    }, _SECONDS)
}

export { countConnect, checkOverload };
