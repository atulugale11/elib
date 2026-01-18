import express = require("express");
import { config } from "./config/config";
import { HttpError } from "http-errors";
import createHttpError = require("http-errors");
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();
app.use(express.json()); //middleware to parse json body
//roues
//HTTP methods:GET,POST,PUT,PATCH,DELETE
app.get("/", (req, res, next) => {
   const error = createHttpError(400, "Bad Request Example");
   throw error;
   next(error);
   res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter); // registering user router
app.use(globalErrorHandler); // passing the functoin ref only, so it gets called internally by express
export default app;
