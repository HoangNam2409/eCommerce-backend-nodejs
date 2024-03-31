// Config Environments
import "dotenv/config";

const env = {
    DEV_APP_PORT: process.env.DEV_APP_PORT,
    DEV_APP_HOST: process.env.DEV_APP_HOST,
    DEV_APP_PORT: process.env.DEV_APP_PORT,
    DEV_APP_NAME: process.env.DEV_APP_NAME,

    PRO_APP_PORT: process.env.PRO_APP_PORT,
    PRO_APP_HOST: process.env.PRO_APP_HOST,
    PRO_APP_PORT: process.env.PRO_APP_PORT,
    PRO_APP_NAME: process.env.PRO_APP_NAME,

    NODE_ENV: process.env.NODE_ENV,
};

export { env };
