import mongoose, { Document, Schema } from 'mongoose';

interface NutritionItem {
  name: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: mongoose.Types.ObjectId;
  nutrition?: NutritionItem[];
  images: string[];
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  brand?: string;
  weight?: number;
  status: 'active' | 'draft' | 'hidden' | 'low-stock' | 'out-of-stock';
  createdAt: Date;
  updatedAt: Date;
}

const NutritionItemSchema = new Schema<NutritionItem>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const Product_model = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true, minlength: 10 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    nutrition: { type: [NutritionItemSchema], default: [] },
    images: { type: [String], required: true },    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    brand: { type: String },
    weight: { type: Number },
    status: {
      type: String,
      enum: ['active', 'draft', 'hidden', 'low-stock', 'out-of-stock'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', Product_model);
