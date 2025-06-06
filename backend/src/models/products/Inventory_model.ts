import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;  
  stock: number;                    
  lastStockUpdate: Date;            
  updateStock: (qtyChange: number) => Promise<void>;
}

const Inventory_model = new Schema<IInventory>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,          
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
    },
    lastStockUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

Inventory_model.methods.updateStock = async function (
  this: IInventory,
  qtyChange: number
) {
  const newQty = this.stock + qtyChange;
  if (newQty < 0) {
    throw new Error('Stock cannot go below 0');
  }
  this.stock = newQty;
  this.lastStockUpdate = new Date();
  await this.save();
};

export const Inventory = mongoose.model<IInventory>('Inventory', Inventory_model);
