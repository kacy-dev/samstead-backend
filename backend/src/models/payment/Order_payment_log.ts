// models/PaymentLog.ts
import mongoose from 'mongoose';

const Order_payment_log = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const OrderLog = mongoose.model('OrderLog', Order_payment_log );
