import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  deliveryAddress: string;
  selectedPlan?: mongoose.Types.ObjectId;
  paystackRef?: string;
  isPaid: boolean;
    paymentVerifiedAt?: Date;
  cart: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    addedAt: Date;
  }>;
  orderHistory: Array<{
    orderId: mongoose.Types.ObjectId;
    products: Array<{
      productId: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
    }>;
    orderDate: Date;
    totalAmount: number;
    shippingStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
  }>;
  wishlist: Array<{
    productId: mongoose.Types.ObjectId;
    addedAt: Date;
  }>;
  loginAttempts: number;
  lockUntil: Date | null;
  otp?: string;
  otpRequestedAt?: Date;
  otpExpiry?: Date;
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, minlength: 3 },
    lastName: { type: String, required: true, trim: true, minlength: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, select: false },
    deliveryAddress: {
        type: String, required: true
    },
    selectedPlan: { type: Schema.Types.ObjectId, ref: 'Plan' },
    paystackRef: { type: String },
    isPaid: { type: Boolean, default: false },
    paymentVerifiedAt: { type: Date },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    orderHistory: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
        products: [
          {
            productId: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number,
          },
        ],
        orderDate: { type: Date, default: Date.now },
        totalAmount: Number,
        shippingStatus: {
          type: String,
          enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
          default: 'Pending',
        },
        paymentStatus: {
          type: String,
          enum: ['Pending', 'Completed', 'Failed'],
          default: 'Pending',
        },
      },
    ],
    wishlist: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    otpRequestedAt: { type: Date, select: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
