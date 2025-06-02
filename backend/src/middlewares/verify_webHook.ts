import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const verifyPaystackSignature = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const rawBody = req.body; // raw buffer from bodyParser.raw

  const hash = crypto.createHmac('sha512', secret)
                     .update(rawBody)
                     .digest('hex');

  const signature = req.headers['x-paystack-signature'];

  if (hash !== signature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  // Parse the raw body to JSON manually since bodyParser.raw prevents automatic parsing
  try {
    (req as any).parsedBody = JSON.parse(rawBody.toString());
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid JSON format in webhook body' });
  }
};
