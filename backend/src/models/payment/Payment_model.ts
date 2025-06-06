// models/payment/Payment.ts
import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPayment extends Document {
    user?: mongoose.Types.ObjectId;
    email: string;
    plan?: mongoose.Types.ObjectId;
    reference: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed';
    channel?: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const Payment_model = new Schema<IPayment>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: { type: String, required: true },
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
        reference: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'NGN' },
        status: { type: String, enum: ['success', 'failed'], default: 'success' },
        channel: { type: String },
        paidAt: { type: Date },
    },
    { timestamps: true }
);

export default model<IPayment>('Payment', Payment_model);
