import { Request, Response } from 'express';
import axios from 'axios';
import User from '../../models/auth/User_model';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export const initiatePayment = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId).populate('selectedPlan');
    if (!user || !user.selectedPlan) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        code: ERROR_CODES.UNAUTHORIZED.code,
        message: 'Subscription plan not selected.',
      });
    }

    const amount = user.selectedPlan.price * 100; // in kobo
    const email = user.email;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
        metadata: {
          userId,
          planId: user.selectedPlan._id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { authorization_url, reference } = response.data.data;

    // Optionally store the reference in user for later verification
    user.set({ paystackRef: reference });
    await user.save();

    res.status(STATUS_CODES.OK).json({
      message: 'Redirect to Paystack to complete payment.',
      authorizationUrl: authorization_url,
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODES.INTERNAL_ERROR.code,
      message: 'Payment initiation failed. Please try again.',
    });
  }
};


export const cancelPayment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          code: ERROR_CODES.USER_NOT_FOUND.code,
          message: 'User not found.',
        });
      }
  
      user.set({ paystackRef: undefined, selectedPlan: undefined });
      await user.save();
  
      res.status(STATUS_CODES.OK).json({
        message: 'Payment process cancelled. You can restart anytime.',
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        code: ERROR_CODES.INTERNAL_ERROR.code,
        message: 'Failed to cancel payment.',
      });
    }
};
  

export const paystackWebhook = async (req: Request, res: Response) => {
    const event = (req as any).parsedBody;
  
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
  
      try {
        const user = await User.findOne({ paystackRef: reference });
        if (!user) {
          return res.status(200).send(); 
        }
  
        user.isPaid = true;
        user.paymentVerifiedAt = new Date();
        user.paystackRef = undefined;
        await user.save();
  
        return res.status(200).send();
      } catch (err) {
        console.error('Webhook error:', err);
        return res.status(500).send();
      }
    }
  
    return res.status(200).send();
  };
  
