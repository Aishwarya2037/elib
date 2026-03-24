import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/userModel.js";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");

    return next(error);
  }

  // Database call
  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, "User already exist with this email.");
    return next(error);
  }

  res.json({ message: "User created" });
};

export default createUser;
