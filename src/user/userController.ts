import express = require("express");
import createHttpError = require("http-errors");
import bcrypt = require("bcrypt");
import userModal from "./userModal";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   const { name, email, password } = req.body;
   const user = await userModal.findOne({ email });

   const hashedPassword = await bcrypt.hash(password, 10);

   if (user) {
      const error = createHttpError(409, "User already exists"); // Conflict
      return next(error); // passing the error to the global error handler middleware
   }
   //validation
   if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required"); // Bad Request
      return next(error); // passing the error to the global error handler middleware
   }

   const newUser = await userModal.create({
      name,
      email,
      password: hashedPassword,
   });

   const token = sign({ sub: newUser._id }, config.jswtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256", // HMAC using SHA-256 hash algorithm default is HS256
   });
   //logic for creating user
   res.json({ accessToken: token });
};

export { createUser };
