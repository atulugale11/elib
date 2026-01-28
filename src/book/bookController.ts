import express = require("express");

const createBook = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   // Logic for creating a book
};

export { createBook };
