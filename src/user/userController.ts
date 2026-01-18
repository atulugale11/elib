import express = require("express");
import createHttpError = require("http-errors");

const createUser = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) => {
   const { name, email, password } = req.body;

   //validation
   if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required"); // Bad Request
      return next(error); // passing the error to the global error handler middleware
   }
   //logic for creating user
   res.json({ message: "User created " });
};

export { createUser };
