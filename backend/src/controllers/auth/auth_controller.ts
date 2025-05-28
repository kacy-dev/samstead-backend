import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../../models/User';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';
import { sendUserOtpEmail } from '../../config/mailer_config';

// Generate a 4-digit OTP
const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Check if account is currently locked
const isAccountLocked = (user: IUser): boolean => {
  return !!(user.lockUntil && user.lockUntil > new Date());
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.USER_EXISTS.message,
        code: ERROR_CODES.USER_EXISTS.code,
        success: false,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpiry,
      isActive: false,
    });

    await newUser.save();

    await sendUserOtpEmail(email, firstName, otp);

    res.status(STATUS_CODES.OK).json({
      message: 'User registration successful. OTP sent to your email.',
      success: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.REGISTRATION_FAILED.message,
      code: ERROR_CODES.REGISTRATION_FAILED.code,
      success: false,
    });
  }
};


export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email }).select('+otp +otpExpiry');
      if (!user) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.USER_NOT_FOUND.message,
          code: ERROR_CODES.USER_NOT_FOUND.code,
          success: false,
        });
        return;
      }
  
      if (!user.otp || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: 'Invalid or expired OTP provided',
          success: false,
        });
        return;
      }
  
      if (user.otp !== otp) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: 'Invalid OTP provided',
          success: false,
        });
        return;
      }
  
      user.isActive = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
  
      // Proceed to subscription selection
      await user.save();
  
      res.status(STATUS_CODES.OK).json({
        message: 'Account verified successfully. Please proceed to choose a subscription plan.',
        success: true,
        nextStep: 'subscription-selection',
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: ERROR_CODES.VERIFICATION_FAILED.message,
        code: ERROR_CODES.VERIFICATION_FAILED.code,
        success: false,
      });
    }
  };