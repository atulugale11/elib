import express = require("express");
import { createBook } from "./bookController";
import multer = require("multer");
import path = require("path");
const bookRouter = express.Router();

const upload = multer({
   dest: path.resolve(__dirname, "../../public/data/uploads"),
   limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB file size limit
});
bookRouter.post(
   "/",
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
   ]),
   createBook,
);

export default bookRouter;
