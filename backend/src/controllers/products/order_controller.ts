import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order, ShippingStatus, PaymentMethod, PaymentStatus } from '../../models/products/Order_model';   // path as needed
import { OrderLog } from '../../models/payment/Order_payment_log';
import { Inventory } from '../../models/products/Inventory_model'; 
import { generateOrderCode } from '../../utils/generate_orderCode';         // to validate product refs (optional)
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';
import axios from 'axios';
import crypto from "crypto";
export interface OrderItemDto {
    product: string;
    quantity: number;
    price: number;
  }
  
  type PaymentMethod = 'Card' | 'Cash';
interface CreateOrderBody {
  user: string;
  items: OrderItemDto[];
  shippingAddress?: ShippingAddressDto;
  paymentMethod: PaymentMethod;
  deliveryFee: number;
  premiumDiscount?: number;
  email: string;
  nameOnCard?: string;
}

export interface IOrderItem {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    size: string;
}

export interface IOrder {
    _id: Types.ObjectId;
    orderCode: string;
    user: Types.ObjectId;
    items: IOrderItem[];
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
    createdAt: Date;
    updatedAt: Date;
  }
interface OrderIdParams {
    id: string;
}

type ShippingStatus = 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
interface UpdateStatusBody {
  status: ShippingStatus;
}


export const createOrder = async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
    try {
      const {
        user,
        items,
        shippingAddress,
        email,
        nameOnCard,
        deliveryFee,
        premiumDiscount = 0,
        paymentMethod,
      } = req.body;
  
      if (!user || !items?.length || !email || !paymentMethod) {
        return res.status(STATUS_CODES.BAD_REQUEST).json(ERROR_CODES.VALIDATION_ERROR);
      }
  
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalPayable = subtotal + deliveryFee - (subtotal * premiumDiscount / 100);
      const orderCode = await generateOrderCode();
  
      const order = new Order({
        orderCode,
        user,
        items,
        shippingAddress,
        email,
        nameOnCard,
        deliveryFee,
        premiumDiscount,
        orderTotal: subtotal,
        totalPayable,
        paymentMethod,
        shippingStatus: ShippingStatus.Pending,
        paymentStatus: paymentMethod === 'Card' ? PaymentStatus.Pending : PaymentStatus.Completed,
      });
  
      const savedOrder = await order.save();
  
      /** ──────────────── IF PAYING WITH CARD ──────────────── **/
      if (paymentMethod === 'Card') {
        const initPayload = {
          email,
          amount: totalPayable * 100, 
          metadata: {
            userId: user,
            orderId: savedOrder._id.toString(),
            orderCode,
          },
        };
  
        const { data } = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          initPayload,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const paystackRef = data.data.reference;
        const paystackUrl = data.data.authorization_url;
  
        return res.status(200).json({
          message: "Redirect to Paystack",
          type: "paystack",
          reference: paystackRef,
          url: paystackUrl,
          orderId: savedOrder._id,
        });
      }
  
      /** ──────────────── IF CASH ON DELIVERY ──────────────── **/
      return res.status(STATUS_CODES.CREATED).json({
        message: "Order placed successfully (Cash on Delivery)",
        type: "cash",
        data: savedOrder,
      });
    } catch (err) {
      console.error("Order Error:", err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(ERROR_CODES.INTERNAL_ERROR);
    }
};
  

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'firstName lastName email plan planCycle status',
        populate: {
          path: 'plan',
          select: 'name price',
        },
      })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    return res.status(STATUS_CODES.OK).json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      data: orders.map(order => ({
        _id: order._id,
        orderCode: order.orderCode,
        user: order.user,
        items: order.items,
        orderTotal: order.orderTotal,
        totalPayable: order.totalPayable,
        deliveryFee: order.deliveryFee,
        premiumDiscount: order.premiumDiscount,
        email: order.email,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingStatus: order.shippingStatus,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      ...ERROR_CODES.INTERNAL_ERROR,
    });
  }
};



export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    const identifier = id.startsWith('#') ? id.slice(1) : id;
  
    try {
      const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  
      const order = await Order.findOne(
        isObjectId ? { _id: identifier } : { orderCode: identifier }
      )
        .populate('user', 'name email plan')
        .populate('items.product', 'name price')
        .lean();
  
      if (!order) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          ...ERROR_CODES.ORDER_NOT_FOUND,
        });
      }
  
      return res.status(STATUS_CODES.OK).json({
        message: 'Order retrieved successfully',
        data: {
          _id: order._id,
          orderCode: order.orderCode,
          user: order.user,
          email: order.email,
          items: order.items,
          orderTotal: order.orderTotal,
          totalPayable: order.totalPayable,
          deliveryFee: order.deliveryFee,
          premiumDiscount: order.premiumDiscount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          shippingStatus: order.shippingStatus,
          shippingAddress: order.shippingAddress,
          nameOnCard: order.nameOnCard,
          orderDate: order.orderDate,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      console.error('Get Order Error:', error);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        ...ERROR_CODES.INTERNAL_ERROR,
      });
    }
  };


  export const updateOrderStatus = async (
    req: Request<OrderIdParams, {}, UpdateStatusBody>,
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
        message: ERROR_CODES.INVALID_SHIPPING_STATUS.message || 'Invalid shipping status',
        code: ERROR_CODES.INVALID_SHIPPING_STATUS.code || 1028,
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
  
      if (order.shippingStatus === status) {
        return res.status(STATUS_CODES.OK).json({
          message: `Shipping status already set to '${status}'`,
          data: order,
        });
      }
  
      order.shippingStatus = status;
      await order.save();
  
      console.log(`Shipping status updated for order ${order.orderCode} (${order._id}) → ${status}`);
  
      return res.status(STATUS_CODES.OK).json({
        message: 'Shipping status updated successfully',
        data: {
          _id: order._id,
          orderCode: order.orderCode,
          status: order.shippingStatus,
        },
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
            message: "Order cancelled succesfully",
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