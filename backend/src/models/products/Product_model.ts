import mongoose, { Document, Schema } from 'mongoose';

interface NutritionItem {
  name: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: mongoose.Types.ObjectId;
  nutrition?: NutritionItem[];  
  image: string;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
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
    description: { type: String, required: true, minlength: 10 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    nutrition: { type: [NutritionItemSchema] },  // Array of NutritionItemSchema
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', Product_model);
