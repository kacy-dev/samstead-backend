import { Request, Response } from 'express';
import axios from 'axios';
import User from '../../models/auth/User_model';
import Plan from '../../models/products/plan_model';
import Payment from '../../models/payment/Payment_model';
import TempPayment from '../../models/payment/TempPayment_model';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// export const initiatePayment = async (req: Request, res: Response) => {
//   const { email, planId, duration } = req.body;

//   if (!email || !planId || !duration) {
//     return res.status(STATUS_CODES.BAD_REQUEST).json({
//       code: ERROR_CODES.MISSING_FIELDS.code,
//       message: 'Email, planId, and duration are required.',
//     });
//   }

//   try {
//     const plan = await Plan.findById(planId);
//     if (!plan) {
//       return res.status(STATUS_CODES.NOT_FOUND).json({
//         code: ERROR_CODES.INVALID_PLAN_ID.code,
//         message: 'Plan not found.',
//       });
//     }

//     const selectedPrice = plan.prices.find((p) => p.duration === duration);
//     if (!selectedPrice) {
//       return res.status(STATUS_CODES.BAD_REQUEST).json({
//         code: ERROR_CODES.INVALID_PLAN_DURATION.code,
//         message: 'Invalid duration selected for this plan.',
//       });
//     }

//     const amount = selectedPrice.amount * 100; // convert to kobo

//     const response = await axios.post(
//       'https://api.paystack.co/transaction/initialize',
//       {
//         email,
//         amount,
//         metadata: {
//           email,
//           planId,
//           duration,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${PAYSTACK_SECRET}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const { authorization_url, reference } = response.data.data;

//     await TempPayment.create({
//       email,
//       planId,
//       reference,
//       status: 'pending',
//     });

//     return res.status(STATUS_CODES.OK).json({
//       message: 'Redirect to Paystack to complete payment.',
//       authorizationUrl: authorization_url,
//     });
//   } catch (error: any) {
//     console.error(error?.response?.data || error.message);
//     return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
//       code: ERROR_CODES.INTERNAL_ERROR.code,
//       message: 'Failed to initiate payment.',
//     });
//   }
// };

export const initiatePayment = async (req: Request, res: Response) => {
  const { email, planId, duration } = req.body;

  // Validate required fields
  if (!email || !planId || !duration) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_FIELDS.code,
      message: 'Email, planId, and duration are required.',
    });
  }

  // Validate duration value
  if (!['monthly', 'yearly'].includes(duration)) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_FIELDS
      .code,
      message: 'Invalid duration. Must be "monthly" or "yearly".',
    });
  }

  try {
    // Find the plan by ID
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        code: ERROR_CODES.UNAUTHORIZED.code,
        message: 'Invalid or missing plan. Please select a subscription plan.',
      });
    }

    // Find the price object matching the duration
    const priceObj = plan.prices.find((p) => p.duration === duration);
    if (!priceObj) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: `The selected plan does not have a "${duration}" price.`,
      });
    }

    // Calculate amount in kobo (smallest currency unit)
    const amount = priceObj.amount * 100;

    // Initialize transaction with Paystack
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
        metadata: {
          email,
          planId,
          duration,
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

    // Save temporary payment record for verification on webhook
    await TempPayment.create({
      email,
      planId,
      duration,
      reference,
      status: 'pending',
    });

    return res.status(STATUS_CODES.OK).json({
      message: 'Redirect to Paystack to complete payment.',
      authorizationUrl: authorization_url,
    });
  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODES.INTERNAL_ERROR.code,
      message: 'Failed to initiate payment. Please try again.',
    });
  }
};

export const cancelPayment = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      code: ERROR_CODES.MISSING_FIELDS.code,
      message: 'Email is required to cancel payment.',
    });
  }

  try {
    const tempPayment = await TempPayment.findOne({ email, status: 'pending' });

    if (!tempPayment) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        code: ERROR_CODES.USER_NOT_FOUND.code,
        message: 'No pending payment found for this email.',
      });
    }

    await TempPayment.deleteOne({ _id: tempPayment._id });

    res.status(STATUS_CODES.OK).json({
      message: 'Payment cancelled successfully.',
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
    const data = event.data;
    const { reference, amount, paid_at, channel, customer, metadata } = data;

    try {
      const existing = await Payment.findOne({ reference });
      if (existing) return res.status(200).send(); // already handled

      const user = await User.findOne({ email: customer.email });

      await Payment.create({
        user: user?._id,
        email: customer.email,
        plan: metadata.planId,
        reference,
        amount,
        channel,
        paidAt: paid_at,
        status: 'success',
      });

      if (user) {
        const now = new Date();
        const planEnd = new Date(now);

        // Simulate plan duration for demo/testing: 2 minutes
        if (metadata.duration === 'monthly') {
          planEnd.setMinutes(planEnd.getMinutes() + 2);
        } else if (metadata.duration === 'yearly') {
          planEnd.setMinutes(planEnd.getMinutes() + 2); // Still 2 minutes for testing
        }

        user.isPaid = true;
        user.isPlanActive = true;
        user.selectedPlan = metadata.planId;
        user.planDuration = metadata.duration;
        user.planStartDate = now;
        user.planEndDate = planEnd;
        user.paymentVerifiedAt = now;
        user.paystackRef = undefined;

        await user.save();
      }

      // update temp payment
      await TempPayment.findOneAndUpdate(
        { reference },
        { status: 'paid', verifiedAt: new Date() }
      );

      return res.status(200).send();
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(500).send();
    }
  }

  return res.status(200).send();
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'email firstName lastName')
      .populate('plan', 'name ')
      .sort({ createdAt: -1 });

    return res.status(STATUS_CODES.OK).json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODES.INTERNAL_ERROR.code,
      message: 'Failed to fetch payment records.',
    });
  }
};


