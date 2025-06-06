// models/payment/TempPayment.ts
import mongoose, { Document, Schema, model } from 'mongoose';

export interface ITempPayment extends Document {
  email: string;
  planId: mongoose.Types.ObjectId;
  reference: string;
  status: 'pending' | 'paid';
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TempPaymentSchema = new Schema<ITempPayment>(
  {
    email: { type: String, required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    reference: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export default model<ITempPayment>('TempPayment', TempPaymentSchema);
