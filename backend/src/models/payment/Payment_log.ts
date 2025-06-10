// models/PaymentLog.ts
import mongoose from 'mongoose';

const Payment_log = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    amount: Number,
    cycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PaymentLog = mongoose.model('PaymentLog', Payment_log);
