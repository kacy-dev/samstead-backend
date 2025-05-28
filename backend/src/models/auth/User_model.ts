import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
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
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
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
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
