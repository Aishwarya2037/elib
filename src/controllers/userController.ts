import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
// import { config } from "dotenv";
import jwt from "jsonwebtoken";

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

  // password--> hash
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Token generation jwt
  const token = jwt.sign(
    { sub: newUser._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
  res.json({ accessToken: token });
};

export default createUser;
