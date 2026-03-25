import express from "express";
import type { Request, Response } from "express";
import userRouter from "./routes/userRoute.js";
import bookRouter from "./routes/bookRoute.js";
import errorMiddleware from "./middleware/middleware.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ static folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/data/uploads")),
);

// http methods:- GET, POST, PUT, PATCH, DELETE
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(errorMiddleware);

export default app;
