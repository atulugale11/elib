import { HttpError } from "http-errors";
import express = require("express");
import { config } from "../config/config";

const globalErrorHandler = (
   err: HttpError,
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) => {
   const statusCode = err.status || 500;
   return res.status(statusCode).json({
      message: err.message,
      errorStack: config.env === "development" ? err.stack : null,
   });
};

export default globalErrorHandler;
