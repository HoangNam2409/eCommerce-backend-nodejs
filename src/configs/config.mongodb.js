"use strict";

import { env } from "./config.environment.js";

// level 0
// const config = {
//     app: {
//         port: 3000,
//     },

//     db: {
//         host: "localhost",
//         port: 27017,
//         name: "shopDev",
//     },
// };

// level 1
// const dev = {
//     app: {
//         port: 300,
//     },

//     db: {
//         host: "localhost",
//         port: 27017,
//         name: "shopDev",
//     },
// };

// const pro = {
//     app: {
//         port: 300,
//     },

//     db: {
//         host: "localhost",
//         port: 27017,
//         name: "shopPro",
//     },
// };

// Level 3
const dev = {
    app: {
        port: env.DEV_APP_PORT || 3052,
    },

    db: {
        host: env.DEV_APP_HOST || "localhost",
        port: env.DEV_APP_PORT || 27017,
        name: env.DEV_APP_NAME || "shopDev",
    },
};

const pro = {
    app: {
        port: env.PRO_APP_PORT || 3000,
    },

    db: {
        host: env.PRO_APP_HOST || "localhost",
        port: env.PRO_APP_PORT || 27017,
        name: env.PRO_APP_NAME || "shopPro",
    },
};

const config = { dev, pro };

export { config };
