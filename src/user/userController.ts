import express = require("express");
import createHttpError = require("http-errors");
import bcrypt = require("bcrypt");
import userModal from "./userModal";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   const { name, email, password } = req.body;

   try {
      const user = await userModal.findOne({ email });
      if (user) {
         const error = createHttpError(409, "User already exists"); // Conflict
         return next(error); // passing the error to the global error handler middleware
      }
   } catch (err) {
      next(createHttpError(500, "Error while getting user"));
   }
   const hashedPassword = await bcrypt.hash(password, 10);

   //validation
   if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required"); // Bad Request
      return next(error); // passing the error to the global error handler middleware
   }

   let newUser: User;
   try {
      newUser = await userModal.create({
         name,
         email,
         password: hashedPassword,
      });
   } catch (err) {
      return next(createHttpError(500, "Error while creating user"));
   }

   try {
      const token = sign({ sub: newUser._id }, config.jswtSecret as string, {
         expiresIn: "7d",
         algorithm: "HS256", // HMAC using SHA-256 hash algorithm default is HS256
      });
      res.status(201).json({ accessToken: token });
   } catch (err) {
      return next(createHttpError(500, "Error while creating token"));
   }
   //logic for creating user
};

const loginUser = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   const { email, password } = req.body;
   if (!email || !password) {
      const error = createHttpError(400, "All fields are required"); // Bad Request
      return next(error); // passing the error to the global error handler middleware
   }
   try {
      const user = await userModal.findOne({ email });
      if (!user) {
         const error = createHttpError(401, "Invalid email or password"); // Unauthorized
         return next(error); // passing the error to the global error handler middleware
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         const error = createHttpError(401, "Invalid email or password"); // Unauthorized
         return next(error); // passing the error to the global error handler middleware
      }
      const token = sign({ sub: user._id }, config.jswtSecret as string, {
         expiresIn: "7d",
         algorithm: "HS256", // HMAC using SHA-256 hash algorithm default is HS256
      });
      res.status(201).json({ accessToken: token }); // login successful
   } catch (err) {
      return next(createHttpError(500, "Error while logging in user"));
   }
};
export { createUser, loginUser };
