import express = require("express");

const createUser = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction
) => {
   //logic for creating user
   res.json({ message: "User created " });
};

export { createUser };
