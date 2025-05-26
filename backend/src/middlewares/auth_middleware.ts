import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Admin from '../models/auth/Admin_model';
import { ERROR_CODES, STATUS_CODES } from '../utils/error_codes';

interface DecodedToken extends JwtPayload {
  adminId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  admin?: any; 
}

export const protectAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        message: ERROR_CODES.UNAUTHORIZED.message,
        code: ERROR_CODES.UNAUTHORIZED.code
     });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    const admin = await Admin.findById(decoded.adminId).select('-password');

    if (!admin) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ 
        message: ERROR_CODES.ADMIN_NOT_FOUND.message,
        code: ERROR_CODES.ADMIN_NOT_FOUND.code
    });
    }

    if (admin.role !== 'admin' && admin.role !== 'superadmin') {
      return res.status(STATUS_CODES.FORBIDDEN).json({ 
        message: ERROR_CODES.UNAUTHORIZED_ACCESS.message,
        code: ERROR_CODES.UNAUTHORIZED_ACCESS.code
    });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        message: ERROR_CODES.INVALID_TOKEN.message,
        code: ERROR_CODES.INVALID_TOKEN.code 
    });
  }
};
