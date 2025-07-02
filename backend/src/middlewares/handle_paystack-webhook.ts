import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { STATUS_CODES, ERROR_CODES } from '../utils/error_codes';
import User, { IUser } from "../models/auth/User_model";
import { Order, PaymentStatus } from '../models/products/Order_model';
import { PaymentLog } from "../models/payment/Payment_log";
import { OrderLog } from '../models/payment/Order_payment_log';     // for grocery orders
import { Plan, IPlan } from "../models/products/plan_model";
import { generateOrderCode } from '../utils/generate_orderCode';         // to validate product refs (optional)

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  const rawBody = JSON.stringify(req.body);
  const signature = req.headers['x-paystack-signature'] as string;

  const computed = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET as string)
    .update(rawBody)
    .digest('hex');

  if (computed !== signature) {
    console.warn('Invalid signature. Potential spoof.');
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      ...ERROR_CODES.UNAUTHORIZED_ACCESS,
      success: false,
    });
  }

  const evt = req.body;
  console.log(`Paystack Webhook Received${evt.event}`);

  if (evt.event !== 'charge.success' || evt.data.status !== 'success') {
    console.warn('Webhook event not relevant or failed payment.');
    return res.sendStatus(200);
  }

  try {
    const reference = evt.data.reference;
    const metadata = evt.data.metadata || {};
    const verificationUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const { data: verificationResponse } = await axios.get(verificationUrl, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
    });

    if (verificationResponse.data.status !== 'success') {
      console.error(`Failed to verify payment for reference: ${reference}`);
      return res.sendStatus(200);
    }

    const paidAmount = evt.data.amount;
    const paidAt = new Date(evt.data.paid_at || evt.data.created_at);

    /** ────────────── PLAN PAYMENT ────────────── **/
    if (metadata?.plan) {
      const userId = metadata?.userId;
      const user = await User.findById(userId).populate<{ plan: IPlan }>('plan');
      if (!user || !user.plan) return res.sendStatus(404);

      const monthlyKobo = user.plan.monthlyPrice * 100;
      const yearlyKobo = user.plan.yearlyPrice * 100;

      let cycle: 'monthly' | 'yearly' | null = null;
      if (paidAmount === monthlyKobo) cycle = 'monthly';
      else if (paidAmount === yearlyKobo) cycle = 'yearly';
      else return res.sendStatus(200); 

      const now = new Date();
      const expires =
        cycle === 'monthly'
          ? new Date(now.setMonth(now.getMonth() + 1))
          : new Date(now.setFullYear(now.getFullYear() + 1));

      user.status = 'ACTIVE';
      user.planCycle = cycle;
      user.planExpiresAt = expires;
      user.lastPayment = {
        reference,
        amount: paidAmount,
        paidAt,
      } as any;

      await user.save();

      await PaymentLog.create({
        user: user._id,
        plan: user.plan._id,
        amount: paidAmount,
        cycle,
        reference,
        paidAt,
      });

      console.log(`Plan payment verified and user updated: ${user.email}`);
    }

    /** ────────────── ORDER PAYMENT ────────────── **/
    else if (metadata?.orderId) {
      const orderId = metadata.orderId;
      const userId = metadata.userId;

      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`Order not found for ID: ${orderId}`);
        return res.sendStatus(404);
      }

      if (order.paymentStatus === PaymentStatus.Completed) {
        console.log(`Order already marked paid: ${orderId}`);
        return res.sendStatus(200);
      }

      order.paymentStatus = PaymentStatus.Completed;
      await order.save();

      await OrderLog.create({
        user: userId,
        order: order._id,
        amount: paidAmount,
        reference,
        paidAt,
      });
    }

    return res.sendStatus(200);
  } catch (err: any) {
    console.error('Webhook processing error:', err.response?.data || err);
    return res.sendStatus(500);
  }
};
