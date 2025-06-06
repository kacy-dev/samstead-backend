import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ShippingStatus {
    Pending = 'Pending',
    Shipped = 'Shipped',
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
    PayPal = 'PayPal',
    BankTransfer = 'BankTransfer',
}
export interface OrderItem {
    product: Types.ObjectId;  // ref Inventory
    quantity: number;
    price: number;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export interface IOrder extends Document {
    user: Types.ObjectId;             // ref User
    items: OrderItem[];
    orderTotal: number;
    shippingAddress: ShippingAddress;
    shippingStatus: ShippingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    orderDate: Date;
    deliveryDate?: Date | null;
    trackingNumber?: string | null;
    customerNotes?: string;
    discountApplied: number;
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

const ShippingAddressSchema = new Schema<ShippingAddress>(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: { type: [OrderItemSchema], required: true },
        orderTotal: { type: Number, required: true, min: 0 },
        shippingAddress: { type: ShippingAddressSchema, required: true },
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
        deliveryDate: { type: Date, default: null },
        trackingNumber: { type: String, default: null },
        customerNotes: { type: String, trim: true },
        discountApplied: { type: Number, default: 0 },
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
