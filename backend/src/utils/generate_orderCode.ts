
import { Counter } from '../models/products/Counter';

export const generateOrderCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: 'order' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(3, '0');
  return `#ORD-${year}${padded}`;
};
