import { config as conf } from "dotenv";
conf();

const _config = {
   port: process.env.PORT,
   databaseURL: process.env.MONGO_CONNECTION_STRING,
   env: process.env.NODE_ENV || "development",
   jswtSecret: process.env.JWT_SECRET || "",
};

export const config = Object.freeze(_config);
