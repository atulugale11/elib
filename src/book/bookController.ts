import express = require("express");
import cloudinary from "../config/cloudinary";
import fs from "node:fs/promises";
import { cp } from "node:fs";
import bookModel from "./bookModel";

const createBook = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   try {
      // Multer already populated this
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      // ✅ Correct files
      const coverImage = files.coverImage?.[0];
      const pdfFile = files.file?.[0];

      if (!coverImage || !pdfFile) {
         return res.status(400).json({
            message: "Cover image and PDF are required",
         });
      }

      // ✅ Upload cover image
      const imageUpload = await cloudinary.uploader.upload(coverImage.path, {
         folder: "book-covers",
         resource_type: "image",
      });

      // ✅ Upload PDF (RAW — NO format override)
      const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
         folder: "books-PDFs",
         resource_type: "raw",
         use_filename: true,
         unique_filename: true,
      });
      console.log("HEEE aahe request body:", req.body);
      await bookModel.create({
         title: req.body.title,
         author: "661338ejd93usdjdj", // ObjectId string
         genre: req.body.genre,
         coverImageUrl: imageUpload.secure_url,
         file: pdfUpload.secure_url,
      });

      // 🧹 Auto-delete local files
      await fs.unlink(coverImage.path);
      await fs.unlink(pdfFile.path);

      return res.status(201).json({
         message: "Book created successfully",
         coverImageUrl: imageUpload.secure_url,
         pdfUrl: pdfUpload.secure_url,
      });
   } catch (error) {
      console.error("Create book failed:", error);
      next(error);
   }
};

export { createBook };
