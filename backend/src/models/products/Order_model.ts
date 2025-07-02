import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ShippingStatus {
    Pending = 'Pending',
    Processing = 'Processing',
    OutForDelivery = 'Out for Delivery',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled',
}

export enum PaymentStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed',
}

export enum PaymentMethod {
    Card = 'Card',
    Cash = 'Cash',
}

export interface OrderItem {
    product: Types.ObjectId;  
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    orderCode: string;
    user: Types.ObjectId;
    items: OrderItem[];
    orderTotal: number;     
    totalPayable: number;   
    deliveryFee: number;
    premiumDiscount: number;
    email: string;
    nameOnCard?: string;
    shippingAddress?: string;
    shippingStatus: ShippingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    orderDate: Date;
    updateOrderStatus: (status: ShippingStatus) => Promise<IOrder>;
    updatePaymentStatus: (status: PaymentStatus) => Promise<IOrder>;
}

const OrderItemSchema = new Schema<OrderItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        orderCode: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [OrderItemSchema], required: true },
        orderTotal: { type: Number, required: true },
        totalPayable: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        premiumDiscount: { type: Number, default: 0 },
        email: { type: String, required: true },
        nameOnCard: { type: String },
        shippingAddress: { type: String, required: false },
        shippingStatus: {
            type: String,
            enum: Object.values(ShippingStatus),
            default: ShippingStatus.Pending,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.Pending,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        orderDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

OrderSchema.methods.updateOrderStatus = function (
    this: IOrder,
    status: ShippingStatus
) {
    this.shippingStatus = status;
    return this.save();
};

OrderSchema.methods.updatePaymentStatus = function (
    this: IOrder,
    status: PaymentStatus
) {
    this.paymentStatus = status;
    return this.save();
};

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
