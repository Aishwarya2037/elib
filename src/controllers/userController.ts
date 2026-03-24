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

  // Database call/ Check if user already exists
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

  // create user
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

    // Send Response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token."));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    const error = createHttpError(400, "Email and password are required");
    return next(error);
  }

  let user;

  // Check user exists
  try {
    user = await userModel.findOne({ email });

    if (!user) {
      const error = createHttpError(404, "User not found");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while fetching user."));
  }

  // Compare password
  try {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = createHttpError(400, "Invalid credentials");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while comparing password."));
  }

  // Generate JWT
  try {
    const token = jwt.sign(
      { sub: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token."));
  }
};

export default loginUser;

export { registerUser, loginUser };
