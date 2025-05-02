import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/user.model";
import { sendOTP as sendOtpToMail, generateOTP } from "../services/sendOTP";

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

    const otp = generateOTP();

    sendOtpToMail(email, otp);

    const newUser = new User({
      email,
      name,
      phoneNumber,
      deliveryAddress,
      password: hashedPassword,
      otp: otp,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please verify your OTP.",
      user_id: newUser._id,
      otp_code: otp,
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
        res.status(400).json({
          message: "Incorrect password",
        });
      } else {
        const token = jwt.sign(
          { userId: user._id, username: user.name },
          jwtSecret,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            full_name: user.name,
            email: user.email,
            phone_number: user.phoneNumber,
            delivery_address: user.deliveryAddress,
          },
        });
      }
    } else {
      res.status(404).json({
        message: "User Not Found",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    // @ts-ignore
    res.status(500).json({ message: error.message || "Server error", error });
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
      const otp = generateOTP();

      sendOtpToMail(email, otp);

      user.otp = otp;

      await user.save();

      res.status(200).json({
        message:
          "If this email is associated with Samstead, an OTP has been sent successfully.",
      });
    } else {
      res.status(200).json({
        message:
          "If this email is associated with Samstead, an OTP has been sent successfully.",
      });
    }
  } catch (error) {
    console.error("Error during sending of otp:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
};

/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verify OTP code sent to the user at forgot-password
 *     description: This endpoint verifies a user's email via OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: ObjectId
 *                 example: 69209b93689020
 *               otpCode:
 *                 type: string
 *                 example: 890378
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *       400:
 *         description: Verification failed. Please try again.
 *       500:
 *         description: Internal server error
 */
export const verify = async (req: Request, res: Response): Promise<void> => {
  const { email, otpCode } = req.body;

  try {
    const user = await User.find({ email });

    if (!user) {
      // @ts-ignore
      res.code = 404;
      throw new Error("User does not exist");
    }

    // @ts-ignore
    if (user && user.otp === otpCode) {
      res.status(200).json({
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({
        message: "Verification failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
}; // For forgot password auth

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP code sent to the user at signup
 *     description: This endpoint verifies a user's email via OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: ObjectId
 *                 example: 69209b93689020
 *               otpCode:
 *                 type: string
 *                 example: 890378
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *       400:
 *         description: Verification failed. Please try again.
 *       500:
 *         description: Internal server error
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { userId, otpCode } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      // @ts-ignore
      res.code = 404;
      throw new Error("User does not exist");
    }

    if (user && user.otp === otpCode) {
      res.status(200).json({
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({
        message: "Verification failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
}; // For signup auth

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
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });

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
    console.error("Error during setting new password:", error);
    res.status(500).json({ message: error || "Server error", error });
  }
};
