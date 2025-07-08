import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../../config/cloudinary_config';
import Admin, { IAdmin } from '../../models/auth/Admin_model';
import User, { IUser } from "../../models/auth/User_model";
import AppSettings, { IAppSettings } from '../../models/auth/App_settings';
import { generateOtp } from '../../utils/otp_generator';
import { sendAdminRegistrationEmail } from '../../config/mailer_config';
import { ERROR_CODES, STATUS_CODES } from '../../utils/error_codes';

// const generateJWT = (adminId: string, role: string): string => {
//   return jwt.sign({ adminId, role }, process.env.JWT_SECRET as string, {
//     expiresIn: '1d',
//   });
// };


interface SettingsBody {
  appName?: string;
  description?: string;
  city?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  officePhone?: string;
  homePhone?: string;
  whatsapp?: string;
}

const generateJWT = (
  adminId: string,
  role: string,
  name: string,
  email: string,
  image?: string
): string => {
  return jwt.sign(
    {
      adminId,
      role,
      name,
      email,
      image,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
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
    const existingAdmin = await Admin.findOne({});
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

    await sendAdminRegistrationEmail(email, username, otp);

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

    const token = generateJWT(
      admin._id.toString(),
      admin.role,
      admin.name,
      admin.email,
      admin.image
    );

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

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
      .populate('plan', 'name price features')
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      deliveryAddress: user.deliveryAddress,
      status: user.status,
      plan: user.plan,
      planCycle: user.planCycle,
      planExpiresAt: user.planExpiresAt,
      lastPayment: user.lastPayment,
      createdAt: user.createdAt,
    }));

    return res.status(STATUS_CODES.OK || 200).json({
      message: 'Users retrieved successfully',
      count: formattedUsers.length,
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR || 500).json({
      ...ERROR_CODES.INTERNAL_ERROR || { message: 'Something went wrong' },
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND || 404).json({
        ...ERROR_CODES.USER_NOT_FOUND || { message: 'User not found' },
      });
    }

    return res.status(STATUS_CODES.OK || 200).json({
      message: 'User deleted successfully',
      data: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR || 500).json({
      ...ERROR_CODES.INTERNAL_ERROR || { message: 'Something went wrong' },
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.USER_NOT_FOUND.message,
        code: ERROR_CODES.USER_NOT_FOUND.code
      });
    }

    return res.status(200).json({ success: true, message: "User retreived successfully", data: user });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const { name, email, status, tier } = req.body;

    if (!name || !email || !status || !tier) {
      return res.status(400).json({
        message: "All fields (name, email, status, tier) are required.",
      });
    }

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const statusMap: Record<string, "ACTIVE" | "INCOMPLETE" | "PLAN_SELECTED" | "EXPIRED"> = {
      Active: "ACTIVE",
      Inactive: "INCOMPLETE",
      Pending: "PLAN_SELECTED",
    };

    const mappedStatus = statusMap[status];
    if (!mappedStatus) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const tierMap: Record<string, "monthly" | "yearly" | undefined> = {
      Premium: "monthly",
      Elite: "yearly",
      Standard: undefined,
    };

    const planCycle = tierMap[tier];

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        status: mappedStatus,
        planCycle,
      },
      { new: true }
    ).select("-password");
    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });



  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json({
      ...ERROR_CODES.INTERNAL_ERROR,
    });
  }
};

export const getAdminDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(STATUS_CODES.OK).json({
    message: 'Welcome to the Admin dashboard',
    admin: req.admin,
  });
};


export const createSettings = async (
  req: Request<{}, {}, SettingsBody>,
  res: Response
) => {
  try {
    const exists = await AppSettings.findOne();
    if (exists) {
      return res.status(400).json({
        message: 'Settings already exist',
        code: ERROR_CODES.VALIDATION_ERROR.code
      });
    }

    let logoUrl: string | undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'app-settings',
        use_filename: true,
        unique_filename: false,
      });
      logoUrl = result.secure_url;
    }

    const settings = new AppSettings({
      ...req.body,
      appLogo: logoUrl
    });

    const saved = await settings.save();
    return res.status(201).json({ message: 'App settings created', data: saved });

  } catch (error) {
    console.error('Create Settings Error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await AppSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'No app settings found' });
    }

    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Fetch Settings Error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

export const getSettingsById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const settings = await AppSettings.findById(req.params.id);
    if (!settings) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.NOT_FOUND.message,
        code: ERROR_CODES.NOT_FOUND.code
      });
    }

    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Get Settings by ID Error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

export const updateSettings = async (
  req: Request<{ id: string }, {}, SettingsBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const existing = await AppSettings.findById(id);
    if (!existing) {
      return res.status(404).json({
        message: 'Settings not found',
        code: ERROR_CODES.NOT_FOUND.code
      });
    }

    let logoUrl = existing.appLogo;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'app-settings',
        use_filename: true,
        unique_filename: false,
      });
      logoUrl = result.secure_url;
    }

    Object.assign(existing, req.body);
    if (logoUrl) existing.appLogo = logoUrl;

    const updated = await existing.save();

    return res.status(200).json({
      message: 'App settings updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update Settings Error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code
    });
  }
};

