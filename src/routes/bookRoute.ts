import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import path from "node:path";
import multer from "multer";
import { fileURLToPath } from "node:url";

const router = express.Router();

// ✅ FIX: define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../public/data/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3e7 },
});

// get
router.get("/", getBooks);
router.get("/:id", getBookById);

// create
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook,
);

// update
router.put(
  "/:id",
  (req, res, next) => {
    console.log("PUT ROUTE HIT");
    next();
  },
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook,
);

// delete
router.delete("/:id", deleteBook);

export default router;
