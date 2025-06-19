import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/auth/User_model';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';
import { sendResendOtpEmail } from '../../config/mailer_config';
import { sendUserRegistrationEmail } from '../../config/mailer_config';

const generateJWT = (userId: string, email: string): string => {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  };
  
// Generate a 4-digit OTP
const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


const isAccountLocked = (user: IUser): boolean => {
  return !!(user.lockUntil && user.lockUntil > new Date());
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, phoneNumber, deliveryAddress } = req.body;

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
    const otpRequestedAt = new Date(Date.now());

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      deliveryAddress,
      otp,
      otpExpiry,
      otpRequestedAt,
      isActive: false,
    });

    await newUser.save();

    await sendUserRegistrationEmail(email, firstName, otp);

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
      const user = await User.findOne({ email }).select('+otp +otpExpiry +otpRequestedAt');
      if (!user) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.USER_NOT_FOUND.message,
          code: ERROR_CODES.USER_NOT_FOUND.code,
          success: false,
        });
        return;
      }
  
      if (!user.otp || !user.otpRequestedAt || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
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
      user.otpRequestedAt = undefined
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
        message: ERROR_CODES.OTP_VERIFICATION_FAILED.message,
        code: ERROR_CODES.OTP_VERIFICATION_FAILED.code,
        success: false,
      });
    }
  };


  export const resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email }).select('+otp +otpExpiry +otpRequestedAt');
  
      if (!user) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.USER_NOT_FOUND.message,
          code: ERROR_CODES.USER_NOT_FOUND.code,
          success: false,
        });
        return;
      }
  
      const now = new Date();
      const lastRequested = user.otpRequestedAt || new Date(0);
  
      const timeDiff = now.getTime() - lastRequested.getTime();
      if (timeDiff < 60 * 1000) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.OTP_RESEND_TOO_EARLY.message,
          code: ERROR_CODES.OTP_RESEND_TOO_EARLY.code,
          success: false,
          waitTimeInSeconds: Math.ceil((60 * 1000 - timeDiff) / 1000),
        });
        return;
      }
  
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
  
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpRequestedAt = now;
  
      await user.save();
  
      await sendResendOtpEmail(email, otp);
  
      res.status(STATUS_CODES.OK).json({
        message: 'New OTP sent successfully to your email.',
        success: true,
        nextStep: 'otp-verification',
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to resend OTP. Please try again.',
        code: 5001, 
        success: false,
      });
    }
  };


  
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
  
      if (!user) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.INVALID_CREDENTIALS.message,
          code: ERROR_CODES.INVALID_CREDENTIALS.code,
          success: false,
        });
        return;
      }
  
      if (!user.isActive) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          message: 'Account is not verified. Please complete OTP verification and subscription first.',
          success: false,
          nextStep: 'otp-verification-or-subscription',
        });
        return;
      }
  
      if (isAccountLocked(user)) {
        res.status(STATUS_CODES.FORBIDDEN).json({
          message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
          code: ERROR_CODES.ACCOUNT_LOCKED.code,
          success: false,
          lockUntil: user.lockUntil,
        });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        user.loginAttempts += 1;
  
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
        }
  
        await user.save();
  
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: ERROR_CODES.INVALID_CREDENTIALS.message,
          code: ERROR_CODES.INVALID_CREDENTIALS.code,
          success: false,
        });
        return;
      }
  
      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
  
      const token = generateJWT(user._id, user.email); 
  
      res.status(STATUS_CODES.OK).json({
        message: 'Login successful',
        success: true,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: ERROR_CODES.LOGIN_FAILED.message,
        code: ERROR_CODES.LOGIN_FAILED.code,
        success: false,
      });
    }
  };

 