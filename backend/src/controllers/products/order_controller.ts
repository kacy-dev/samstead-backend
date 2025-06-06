import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order, PaymentMethod, ShippingStatus } from '../../models/products/Order_model';   // path as needed
import { Inventory } from '../../models/products/Inventory_model';          // to validate product refs (optional)
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';

interface OrderItemDto {
    product: string;
    quantity: number;
    price: number;
}

interface ShippingAddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

interface CreateOrderBody {
    user: string;
    items: OrderItemDto[];
    shippingAddress: ShippingAddressDto;
    paymentMethod: PaymentMethod;
    customerNotes?: string;
    discountApplied?: number;
}

export interface IOrderItem {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    size: string;
}

export interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export interface IOrder {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    items: IOrderItem[];
    orderTotal: number;
    shippingAddress: IShippingAddress;
    shippingStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentStatus: 'Pending' | 'Completed' | 'Failed';
    paymentMethod: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer';
    orderDate: Date;
    deliveryDate: Date | null;
    trackingNumber: string | null;
    customerNotes?: string;
    discountApplied: number;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderIdParams {
    id: string;
}

interface UpdateStatusBody {
    status: ShippingStatus;
}


export const createOrder = async (
    req: Request<{}, {}, CreateOrderBody>,
    res: Response
) => {
    try {
        const {
            user,
            items,
            shippingAddress,
            paymentMethod,
            customerNotes,
            discountApplied = 0,
        } = req.body;

        if (!user || !items?.length) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: ERROR_CODES.VALIDATION_ERROR.message,
                code: ERROR_CODES.VALIDATION_ERROR.code,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: ERROR_CODES.VALIDATION_ERROR.message,
                code: ERROR_CODES.VALIDATION_ERROR.code,
            });
        }

        for (const item of items) {
            if (
                !mongoose.Types.ObjectId.isValid(item.product) ||
                item.quantity <= 0 ||
                item.price < 0
            ) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: ERROR_CODES.VALIDATION_ERROR.message,
                    code: ERROR_CODES.VALIDATION_ERROR.code,
                });
            }
        }

        // Validate payment method enum
        if (!Object.values(PaymentMethod).includes(paymentMethod)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: ERROR_CODES.INVALID_PAYMENT_METHOD.message,
                code: ERROR_CODES.INVALID_PAYMENT_METHOD.code,
            });
        }

        /* ---------- Calculate totals ---------- */
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const totalAfterDiscount =
            subtotal - subtotal * (discountApplied > 0 ? discountApplied : 0) / 100;

        const order = new Order({
            user,
            items,
            shippingAddress,
            paymentMethod,
            customerNotes,
            discountApplied,
            orderTotal: totalAfterDiscount,
        });

        const savedOrder = await order.save();

        return res.status(STATUS_CODES.CREATED).json({
            message: 'Order created successfully',
            data: savedOrder,
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};

export const getAllOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        return res.status(STATUS_CODES.OK).json({
            message: 'Orders retrieved successfully',
            data: orders,
        });
    } catch (error) {
        console.error('Get All Orders Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};

// Get a single order by ID
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            message: ERROR_CODES.VALIDATION_ERROR.message,
            code: ERROR_CODES.VALIDATION_ERROR.code,
        });
    }

    try {
        const order = await Order.findById(id)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.ORDER_NOT_FOUND.message,
                code: ERROR_CODES.ORDER_NOT_FOUND.code,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            message: 'Order retrieved successfully',
            data: order,
        });
    } catch (error) {
        console.error('Get Order By ID Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};


export const updateOrderStatus = async (
    req: Request<OrderIdParams, any, UpdateStatusBody>,
    res: Response
) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            message: ERROR_CODES.VALIDATION_ERROR.message,
            code: ERROR_CODES.VALIDATION_ERROR.code,
        });
    }

    if (!Object.values(ShippingStatus).includes(status)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            message: ERROR_CODES.INVALID_SHIPPING_STATUS?.message || 'Invalid shipping status',
            code: ERROR_CODES.INVALID_SHIPPING_STATUS?.code || 1028,
        });
    }

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.ORDER_NOT_FOUND.message,
                code: ERROR_CODES.ORDER_NOT_FOUND.code,
            });
        }

        order.shippingStatus = status;
        const updatedOrder = await order.save();

        return res.status(STATUS_CODES.OK).json({
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};

export const cancelOrder = async (
    req: Request<OrderIdParams>,
    res: Response
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            message: ERROR_CODES.VALIDATION_ERROR.message,
            code: ERROR_CODES.VALIDATION_ERROR.code,
        });
    }

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.ORDER_NOT_FOUND.message,
                code: ERROR_CODES.ORDER_NOT_FOUND.code,
            });
        }

        if (
            order.shippingStatus === ShippingStatus.Shipped ||
            order.shippingStatus === ShippingStatus.Delivered
        ) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message:
                    ERROR_CODES.ORDER_CANNOT_BE_CANCELLED?.message ||
                    'Order cannot be cancelled after it has been shipped or delivered',
                code: ERROR_CODES.ORDER_CANNOT_BE_CANCELLED?.code || 1029,
            });
        }

        order.shippingStatus = ShippingStatus.Cancelled;
        const updatedOrder = await order.save();

        return res.status(STATUS_CODES.OK).json({
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        console.error('Cancel Order Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};

export const deleteOrder = async (
    req: Request<OrderIdParams>,
    res: Response
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            message: ERROR_CODES.VALIDATION_ERROR.message,
            code: ERROR_CODES.VALIDATION_ERROR.code,
        });
    }

    try {
        const deleted = await Order.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: ERROR_CODES.ORDER_NOT_FOUND.message,
                code: ERROR_CODES.ORDER_NOT_FOUND.code,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        console.error('Delete Order Error:', error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ERROR_CODES.INTERNAL_ERROR.message,
            code: ERROR_CODES.INTERNAL_ERROR.code,
        });
    }
};