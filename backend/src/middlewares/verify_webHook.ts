import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES, STATUS_CODES } from '../utils/error_codes';


export const verifyPaystackSignature = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = req.headers['x-paystack-signature'];

  if (!signature) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      code: ERROR_CODES.UNAUTHORIZED.code,
      message: 'Missing Paystack signature.',
    });
  }

  try {
    const rawBody = (req as any).rawBody; // Must be provided via middleware
    const computedHash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    if (computedHash !== signature) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        code: ERROR_CODES.UNAUTHORIZED.code,
        message: 'Invalid Paystack signature.',
      });
    }

    (req as any).parsedBody = JSON.parse(rawBody.toString());
    next();
  } catch (error: any) {
    console.error('Signature verification error:', error.message);
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      code: 'INVALID_WEBHOOK_BODY',
      message: 'Invalid webhook body format.',
    });
  }
};
