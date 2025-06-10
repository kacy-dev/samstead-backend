import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  description?: string;
  monthlyPrice: number;  // price in kobo (₦1000 ⇒ 100000)
  yearlyPrice:  number;  // price in kobo
  paystackMonthlyCode: string;
  paystackYearlyCode:  string;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const plan_model = new Schema<IPlan>(
  {
    name:  { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice:  { type: Number, required: true },
    paystackMonthlyCode: { type: String, required: true },
    paystackYearlyCode:  { type: String, required: true },
    features: [{ type: String }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
);

export const Plan = mongoose.model<IPlan>('Plan', plan_model);