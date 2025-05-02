import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId | null;
  price: number;
  description: string;
  image: string;
  slashedPrice: number;
}

const productSchema: Schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    slashedPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export { Product, IProduct };
