// import type { Request, Response, NextFunction } from "express";

// const createBook = async (req: Request, res: Response, next: NextFunction) => {
//   // const {} = req.body;
//   console.log("files", req.files);

//   res.json({});
// };

// export { createBook };

import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Book from "../models/bookModel.js";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, author, genre } = req.body;

    // ✅ validation
    if (!title || !author || !genre) {
      return next(createHttpError(400, "All fields are required"));
    }

    // ✅ type-safe files
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (!files || !files.coverImage || !files.file) {
      return next(createHttpError(400, "Cover image and PDF are required"));
    }

    // ✅ extra safety for TS
    const coverImageFile = files.coverImage[0];
    const pdfFile = files.file[0];

    if (!coverImageFile || !pdfFile) {
      return next(createHttpError(400, "Files are missing"));
    }

    const coverImage = coverImageFile.filename;
    const file = pdfFile.filename;

    const book = await Book.create({
      title,
      author,
      genre,
      coverImage,
      file,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
