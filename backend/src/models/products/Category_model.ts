import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Category_model: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Category name must be less than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description must be less than 300 characters'],
    },
    image: {
      type: String,
      validate: {
        validator: (v: string) =>
          /^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9&%=~_.-]*)*/.test(v),
        message: 'Invalid image URL',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

Category_model.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Category = mongoose.model<ICategory>('Category', Category_model );
