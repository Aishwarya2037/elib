import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Book from "../models/bookModel.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get All Books
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const books = await Book.find().populate("author", "name email");

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// get one book
export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate("author", "name email");

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// create book
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

// update book
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, genre } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    // ✅ file path
    const uploadPath = path.resolve(__dirname, "../../public/data/uploads");

    // ✅ update cover image
    if (files?.coverImage?.[0]) {
      // delete old
      const oldImagePath = path.join(uploadPath, book.coverImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      book.coverImage = files.coverImage[0].filename;
    }

    // ✅ update pdf
    if (files?.file?.[0]) {
      const oldFilePath = path.join(uploadPath, book.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      book.file = files.file[0].filename;
    }

    // ✅ update fields
    if (title) book.title = title;
    if (genre) book.genre = genre;

    await book.save();

    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// delete book
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const uploadPath = path.resolve(__dirname, "../../public/data/uploads");

    // ✅ delete cover image
    const imagePath = path.join(uploadPath, book.coverImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // ✅ delete pdf
    const filePath = path.join(uploadPath, book.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Book.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
