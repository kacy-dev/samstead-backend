import mongoose, { Schema, Document } from 'mongoose';

interface IPlanPrice {
  duration: 'monthly' | 'yearly';
  amount: number;
}

export interface IPlan extends Document {
  name: string;
  description: string;
  prices: IPlanPrice[];
  benefits: string[];
  createdBy: mongoose.Types.ObjectId;
}

const plan_model: Schema<IPlan> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    prices: [
      {
        duration: {
          type: String,
          enum: ['monthly', 'yearly'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPlan>('Plan', plan_model);