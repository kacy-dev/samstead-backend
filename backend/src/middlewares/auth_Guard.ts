import { Response, NextFunction } from 'express';
import { ERROR_CODES, STATUS_CODES } from "../utils/error_codes";
import jwt from 'jsonwebtoken';


export const authGuard = (
    req: AuthedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        ...ERROR_CODES.UNAUTHORIZED,
        success: false,
      });
  
    try {
      const payload = jwt.verify(
        authHeader.split(" ")[1],
        process.env.JWT_SECRET as string
      ) as { userId: string };
      req.user = { userId: payload.userId };
      next();
    } catch {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        ...ERROR_CODES.INVALID_TOKEN,
        success: false,
      });
    }
  };