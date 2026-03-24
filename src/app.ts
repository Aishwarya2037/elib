import express from "express";
import type { Request, Response } from "express";
import userRouter from "./routes/userRoute.js";

const app = express();

// http methods:- GET, POST, PUT, PATCH, DELETE
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);

// Global error handler

export default app;
