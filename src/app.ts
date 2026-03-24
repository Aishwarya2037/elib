import express from "express";
import type { Request, Response } from "express";
import userRouter from "./routes/userRoute.js";
import bookRouter from "./routes/bookRoute.js";
import errorMiddleware from "./middleware/middleware.js";

const app = express();

app.use(express.json());

// http methods:- GET, POST, PUT, PATCH, DELETE
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);
app.use("api/books", bookRouter);

// Global error handler
app.use(errorMiddleware);

export default app;
