import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
// import { config } from "dotenv";
import jwt from "jsonwebtoken";
import type { User } from "../types/userType.js";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");

    return next(error);
  }

  // Database call
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exist with this email.");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user."));
  }

  // password--> hash
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user."));
  }

  // Token generation jwt
  try {
    const token = jwt.sign(
      { sub: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    // Response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token."));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "OK" });
};

export { registerUser, loginUser };
