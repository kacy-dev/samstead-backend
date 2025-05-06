import mongoose, { Document, Schema } from "mongoose";

import { Types } from "mongoose";

interface Order {
  orderId: string;
  product: Types.ObjectId[];
  status: "pending" | "completed" | "shipped";
  orderDate: Date;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  deliveryAddress: string;
  subscription: string;
  orders: Order[];
  role: string;
  profilePicture: string;
  otp: string;
  country: string;
}

const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["Premium", "Elite", "None"],
    default: "None",
  },
  orders: [
    {
      default: [],
    },
  ],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  profilePicture: {
    type: String,
  },
  otp: {
    type: String,
  },
  country: {
    type: String,
    default: null,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser, Order };
