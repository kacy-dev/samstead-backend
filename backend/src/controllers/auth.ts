import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/user.model";
import sendOTPToMail from "../services/sendOTP";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET is not defined");
  throw new Error("JWT_SECRET is not defined");
}

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint allows a user to sign up by providing email, username, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: johnDoe
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               deliveryAddress:
 *                 type: string
 *                 example: "123 Main St, Anytown"
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully!
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       example: johnDoe
 *       400:
 *         description: Bad request - user already exists
 *       500:
 *         description: Internal server error
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phoneNumber, deliveryAddress, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      phoneNumber,
      deliveryAddress,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      user: { email: newUser.email, username: newUser.name },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     description: This endpoint logs in a user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: your_jwt_token_here
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const hashedPassword = user?.password || "";

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      }

      const token = jwt.sign(
        { userId: user._id, username: user.name },
        jwtSecret,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
};

/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP to an existing user
 *     description: This endpoint sends a one-time password to a user using the provided email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: User does not exist
 *       500:
 *         description: Internal server error
 */
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      sendOTPToMail(email);

      res.status(200).json({
        message: "OTP sent successfully",
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
};

/**
 * @swagger
 * /set-new-password:
 *   post:
 *     summary: Change user's password
 *     description: This endpoint is called after otp is sent to user, it is used to set new password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "password1234"
 *               confirmPassword:
 *                 type: string
 *                 example: "password1234"
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password Changed Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: User does not exist
 *       500:
 *         description: Internal server error
 */
export const setNewPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { password, confirmPassword, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (password !== confirmPassword) {
      throw new Error("Passowrd does not match");
    }

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password Changed Successfully",
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
};
