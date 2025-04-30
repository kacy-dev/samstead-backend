import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  name: string;
  icon: string;
}

const categorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export { Category, ICategory };
