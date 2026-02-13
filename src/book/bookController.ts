import express = require("express");
import cloudinary from "../config/cloudinary";
import fs from "node:fs/promises";
import { cp } from "node:fs";
import bookModel from "./bookModel";
import { Authrequest } from "../middlewares/authenticate";
import createHttpError = require("http-errors");
import path from "path";

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

      const _req = req as Authrequest;
      await bookModel.create({
         title: req.body.title,
         author: _req.user?.userId, // ObjectId string
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

const updateBook = async (
   req: express.Request,
   res: express.Response,
   next: express.NextFunction,
) => {
   try {
      const { title, genre } = req.body;
      const bookId = req.params.bookId;

      const book = await bookModel.findOne({ _id: bookId });
      if (!bookId || !book) return next(createHttpError(404, "Book not found"));

      // check access
      const _req = req as Authrequest;
      if (book.author.toString() !== _req?.user?.userId) {
         return next(createHttpError(403, "You can not update other's book"));
      }

      let completeCoverImage = "";
      let completeFileName = "";

      const files = req.files as
         | { [fieldname: string]: Express.Multer.File[] }
         | undefined;

      if (files?.coverImage?.[0]) {
         const filename = files.coverImage[0].filename;

         const filePath = files.coverImage[0].path;

         const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "book-covers",
         });

         completeCoverImage = uploadResult.secure_url;
         await fs.unlink(filePath);
      }

      if (files?.file?.[0]) {
         const bookFilePath = files.file[0].path;

         const uploadResultPdf = await cloudinary.uploader.upload(
            bookFilePath,
            {
               resource_type: "raw",
               folder: "books-PDFs",
            },
         );

         completeFileName = uploadResultPdf.secure_url;
         await fs.unlink(bookFilePath);
      }

      const updatedBook = await bookModel.findOneAndUpdate(
         { _id: bookId },
         {
            title,
            genre,
            coverImageUrl: completeCoverImage || book.coverImageUrl,
            file: completeFileName || book.file,
         },
         { new: true },
      );

      return res.json(updatedBook);
   } catch (error) {
      console.error("Update book failed:", error);
      next(error); // 🔥 this prevents crash
   }
};

export { createBook, updateBook };
