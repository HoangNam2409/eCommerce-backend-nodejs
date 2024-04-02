// Config Environments
import "dotenv/config";

const env = {
    DEV_APP_PORT: process.env.DEV_APP_PORT,
    DEV_DB_HOST: process.env.DEV_DB_HOST,
    DEV_DB_PORT: process.env.DEV_DB_PORT,
    DEV_DB_NAME: process.env.DEV_DB_NAME,

    PRO_APP_PORT: process.env.PRO_APP_PORT,
    PRO_DB_HOST: process.env.PRO_DB_HOST,
    PRO_DB_PORT: process.env.PRO_DB_PORT,
    PRO_DB_NAME: process.env.PRO_DB_NAME,

    NODE_ENV: process.env.NODE_ENV,
};

export { env };
