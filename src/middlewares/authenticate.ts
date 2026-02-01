import { config } from "../config/config";
import express = require("express");
import createHttpError = require("http-errors");
import { verify } from "jsonwebtoken";

export interface Authrequest extends express.Request {
   user?: {
      userId: string;
   };
}

const authenticate = (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   // Authentication logic here
   const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
   if (!token) {
      return next(createHttpError(401, "Authentication token is required"));
   }

   try {
      const parsedToken = token;

      const decoded = verify(parsedToken, config.jswtSecret as string); // Use your actual secret key
      console.log("Decoded token:", decoded);

      const _req = req as Authrequest;
      _req.user = decoded.sub ? { userId: decoded.sub as string } : undefined;
      next();
   } catch (err) {
      return next(createHttpError(403, "Token expired"));
   }

   //    if (parsedToken !== "valid-token") {
   //       return next(createHttpError(403, "Invalid authentication token"));
   //    }
};

export default authenticate;
