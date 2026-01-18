import express = require("express");
import { config } from "./config/config";
import { HttpError } from "http-errors";
import createHttpError = require("http-errors");
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

//roues
//HTTP methods:GET,POST,PUT,PATCH,DELETE
app.get("/", (req, res, next) => {
   const error = createHttpError(400, "Bad Request Example");
   throw error;
   next(error);
   res.json({ message: "Welcome to elib apis" });
});

app.use(globalErrorHandler); // passing the functoin ref only, so it gets called internally by express

export default app;
