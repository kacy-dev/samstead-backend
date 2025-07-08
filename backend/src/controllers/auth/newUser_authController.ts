
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";

import User, { IUser } from "../../models/auth/User_model";
import { PaymentLog } from "../../models/payment/Payment_log";
import { Plan, IPlan } from "../../models/products/plan_model";
import { ERROR_CODES, STATUS_CODES } from "../../utils/error_codes";

const signJwt = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });

interface AuthedRequest extends Request {
  user?: { userId: string };
}

const unauth = (res: Response) =>
  res.status(STATUS_CODES.UNAUTHORIZED).json({
    ...ERROR_CODES.UNAUTHORIZED,
    success: false,
  });

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, deliveryAddress } =
      req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        ...ERROR_CODES.MISSING_FIELDS,
        success: false,
      });

    if (await User.exists({ email }))
      return res.status(STATUS_CODES.CONFLICT).json({
        ...ERROR_CODES.USER_EXISTS,
        success: false,
      });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      phoneNumber,
      deliveryAddress,
      status: "INCOMPLETE",
    });

    console.log(user);

    res.status(STATUS_CODES.CREATED).json({
      message: "Registered. Select a plan to continue.",
      token: signJwt({ userId: user._id }),
      success: true,
    });
  } catch (err) {
    console.error("registerUser:", err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      ...ERROR_CODES.REGISTRATION_FAILED,
      success: false,
    });
  }
};

export const selectPlan = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return unauth(res);
    const { planId } = req.body;
    const plan = await Plan.findById(planId);

    if (!plan)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        ...ERROR_CODES.PLAN_NOT_FOUND,
        success: false,
      });

    await User.findByIdAndUpdate(req.user.userId, {
      plan: plan._id,
      status: "PLAN_SELECTED",
    });

    res.json({
      message: "Plan stored. Continue to payment.",
      paymentOptions: {
        monthly: {
          price: plan.monthlyPrice,
          planCode: plan.paystackMonthlyCode,
        },
        yearly: {
          price: plan.yearlyPrice,
          planCode: plan.paystackYearlyCode,
        },
      },
      success: true,
    });
  } catch (err) {
    console.error("selectPlan:", err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      ...ERROR_CODES.INTERNAL_ERROR,
      success: false,
    });
  }
};

export const initializePayment = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return unauth(res);

    const user = await User.findById(req.user.userId).populate<{ plan: IPlan }>(
      "plan"
    );

    if (!user || user.status !== "PLAN_SELECTED" || !user.plan)
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        ...ERROR_CODES.PLAN_SELECTION_REQUIRED,
        success: false,
      });

    const buildTx = async (planCode: string, amount: number) => {
      const { data } = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: user.email,
          amount,
          plan: planCode,
          metadata: { userId: user._id.toString() },
          callback_url: `${process.env.FRONTEND_URL}/payment/completed`,
        },
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
      );
      return data.data as { authorization_url: string; reference: string };
    };

    const monthlyTx = await buildTx(
      user.plan.paystackMonthlyCode,
      user.plan.monthlyPrice
    );
    const yearlyTx = await buildTx(
      user.plan.paystackYearlyCode,
      user.plan.yearlyPrice
    );
    // Save refs for later verification (optional – store latest)
    user.lastPayment = {
      reference: "PENDING",
      amount: 0,
      paidAt: new Date(),
    } as any;
    await user.save();

    res.json({
      monthly: monthlyTx,
      yearly: yearlyTx,
      success: true,
    });
  } catch (err: any) {
    console.error("initializePayment:", err.response?.data || err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      ...ERROR_CODES.PAYMENT_FAILED,
      success: false,
    });
  }
};

/* ________________ WebHook verification controller for all payments and authomatic update of the DB only on successful verifcation ____________ */
// export const paystackWebhook = async (req: Request, res: Response) => {

//   const rawBody = JSON.stringify(req.body);
//   const signature = req.headers["x-paystack-signature"] as string;
//   const computed = crypto
//     .createHmac("sha512", process.env.PAYSTACK_SECRET as string)
//     .update(rawBody)
//     .digest("hex");

//   if (computed !== signature) {
//     return res.status(STATUS_CODES.UNAUTHORIZED).json({
//       ...ERROR_CODES.UNAUTHORIZED_ACCESS,
//       success: false,
//     });
//   }

//   const evt = req.body;
//   if (evt.event !== "charge.success" || evt.data.status !== "success") {
//     return res.sendStatus(200);
//   }

//   try {

//     const verificationUrl = `https://api.paystack.co/transaction/verify/${evt.data.reference}`;

//     const { data: verificationResponse } = await axios.get(verificationUrl, {
//       headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
//     });

//     if (verificationResponse.data.status !== "success") {
//       return res.sendStatus(200);
//     }

//     /* ---------- Find user & plan ---------- */
//     const userId = evt.data.metadata?.userId;
//     const user = await User.findById(userId).populate<{ plan: IPlan }>("plan");
//     if (!user) {
//       return res.sendStatus(200);
//     }

//     /* ---------- Amount matching (convert DB naira → kobo) ---------- */
//     const amtKobo = evt.data.amount;                  // Paystack gives kobo
//     const monthlyKobo = user.plan.monthlyPrice * 100;     // DB stored in naira
//     const yearlyKobo = user.plan.yearlyPrice * 100;     // convert to kobo

//     let cycle: "monthly" | "yearly" | null = null;
//     if (amtKobo === monthlyKobo) cycle = "monthly";
//     else if (amtKobo === yearlyKobo) cycle = "yearly";
//     else {
//       return res.sendStatus(200);
//     }

//     /* ---------- Update user subscription ---------- */
//     const now = new Date();
//     const expires =
//       cycle === "monthly"
//         ? new Date(now.setMonth(now.getMonth() + 1))
//         : new Date(now.setFullYear(now.getFullYear() + 1));

//     user.status = "ACTIVE";
//     user.planCycle = cycle;
//     user.planExpiresAt = expires;
//     user.lastPayment = {
//       reference: evt.data.reference,
//       amount: amtKobo,             
//       paidAt: new Date(evt.data.paid_at),
//     } as any;
//     await user.save();

//     await PaymentLog.create({
//       user: user._id,
//       plan: user.plan._id,
//       amount: amtKobo,
//       cycle,
//       reference: evt.data.reference,
//       paidAt: new Date(evt.data.paid_at || evt.data.created_at),
//     });

//     res.sendStatus(200);
//   } catch (err: any) {
//     console.error(" Webhook error:", err.response?.data || err);
//     res.sendStatus(500);
//   }
// };


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        ...ERROR_CODES.MISSING_FIELDS,
        success: false,
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(STATUS_CODES.NOT_FOUND).json({
        ...ERROR_CODES.USER_NOT_FOUND,
        success: false,
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        ...ERROR_CODES.INVALID_CREDENTIALS,
        success: false,
      });

    if (user.status !== "ACTIVE" || (user.planExpiresAt && user.planExpiresAt < new Date())) {
      // Auto-set expired status
      if (user.planExpiresAt && user.planExpiresAt < new Date()) {
        user.status = "EXPIRED";
        await user.save();
      }
      return res.status(STATUS_CODES.FORBIDDEN).json({
        ...ERROR_CODES.UNAUTHORIZED_ACCESS,
        success: false,
      });
    }

    res.json({ token: signJwt({ userId: user._id }), success: true });
  } catch (err) {
    console.error("loginUser:", err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      ...ERROR_CODES.LOGIN_FAILED,
      success: false,
    });
  }
};

