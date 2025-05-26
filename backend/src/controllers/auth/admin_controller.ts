import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../../models/auth/Admin_model';
import generateOtp from '../../utils/otp_generator';
import { sendEmail } from '../../config/mailer_config';
import { ERROR_CODES, STATUS_CODES } from '../../utils/error_codes';

const generateJWT = (adminId: string, role: string): string => {
  return jwt.sign({ adminId, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
};

const isAccountLocked = (admin: IAdmin): boolean => {
  return !!(admin.lockUntil && admin.lockUntil > Date.now());
};

export const registerAdmin = async (
    req: Request, 
    res: Response
    ): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.ADMIN_EXISTS.message,
        code: ERROR_CODES.ADMIN_EXISTS.code,
        success: false,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isActive: false,
    });

    await newAdmin.save();

    await sendEmail(email, 'Verify Your Account', otp, username, 'registration');

    res.status(STATUS_CODES.OK).json({
      message: 'Admin registration successful. OTP has been sent to your email.',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.REGISTRATION_FAILED.message,
      code: ERROR_CODES.REGISTRATION_FAILED.code,
      success: false,
    });
  }
};

export const verifyOTP = async (
    req: Request, 
    res: Response
    ): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select('+otp +otpExpiry');
    if (!admin) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.ADMIN_NOT_FOUND.message,
        code: ERROR_CODES.ADMIN_NOT_FOUND.code,
        success: false,
      });
      return;
    }

    if (!admin.otp || !admin.otpExpiry || admin.otpExpiry < new Date()) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.OTP_EXPIRED.message,
        code: ERROR_CODES.OTP_EXPIRED.code,
        success: false,
      });
      return;
    }

    if (admin.otp !== otp) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.INVALID_OTP.message,
        code: ERROR_CODES.INVALID_OTP.code,
        success: false,
      });
      return;
    }

    admin.isActive = true;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    res.status(STATUS_CODES.OK).json({
      message: 'Admin activated successfully. Please proceed to login.',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.OTP_VERIFICATION_FAILED.message,
      code: ERROR_CODES.OTP_VERIFICATION_FAILED.code,
      success: false,
    });
  }
};

export const loginAdmin = async (
    req: Request,
    res: Response
    ): Promise<void> => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select('+password +loginAttempts +lockUntil');
    if (!admin) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.INVALID_CREDENTIALS.message,
        code: ERROR_CODES.INVALID_CREDENTIALS.code,
        success: false,
      });
      return;
    }

    if (isAccountLocked(admin)) {
      res.status(STATUS_CODES.FORBIDDEN).json({
        message: ERROR_CODES.ACCOUNT_LOCKED.message,
        code: ERROR_CODES.ACCOUNT_LOCKED.code,
        success: false,
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      admin.loginAttempts = (admin.loginAttempts || 0) + 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 min
      }
      await admin.save();

      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERROR_CODES.INVALID_CREDENTIALS.message,
        code: ERROR_CODES.INVALID_CREDENTIALS.code,
        success: false,
      });
      return;
    }

    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    await admin.save();

    const token = generateJWT(admin._id.toString(), admin.role);

    res.status(STATUS_CODES.OK).json({
      message: 'Login successful',
      success: true,
      data: token,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.LOGIN_FAILED.message,
      code: ERROR_CODES.LOGIN_FAILED.code,
      success: false,
    });
  }
};

export const getAdminDashboard = async (
    req: Request, 
    res: Response
    ): Promise<void> => {
  res.status(STATUS_CODES.OK).json({
    message: 'Welcome to the Admin dashboard',
    admin: req.user,
  });
};
