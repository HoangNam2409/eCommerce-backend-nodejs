import app from "./src/app.js";
import { env } from "./src/configs/config.environment.js";

const PORT = env.PORT || 3056;

const server = app.listen(PORT, () =>
    console.log(`WSV eCommerce start with port: ${PORT}`)
);

// process.on("SIGINT", () => {
//     server.close(() => console.log("Exit Server Express"));
// });
