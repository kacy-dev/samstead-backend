import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/auth/User_model';
import { ERROR_CODES, STATUS_CODES } from '../utils/error_codes';

interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protectUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      message: ERROR_CODES.UNAUTHORIZED.message,
      code: ERROR_CODES.UNAUTHORIZED.code,
    });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: ERROR_CODES.USER_NOT_FOUND.message,
        code: ERROR_CODES.USER_NOT_FOUND.code,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      message: ERROR_CODES.INVALID_TOKEN.message,
      code: ERROR_CODES.INVALID_TOKEN.code,
    });
  }
};
