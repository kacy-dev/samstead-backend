import express from 'express';

import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByIdentifier,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from '../../controllers/products/order_controller';
const { protectAdmin } = require('../../middlewares/auth_middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and retrieval
 */

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order
 *     description: Place a new order with user, items, shipping address, and payment details
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - items
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID placing the order
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                     - price
 *                     - size
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Inventory/Product ID
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                     size:
 *                       type: string
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - country
 *                   - zip
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zip:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [Credit Card, Debit Card, PayPal, Bank Transfer]
 *               customerNotes:
 *                 type: string
 *               discountApplied:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error or missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/orders/create', createOrder);

/**
 * @swagger
 * /api/orders/all-orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     description: Retrieve a list of all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       500:
 *         description: Internal server error
 */
router.get('/orders/all-orders', getAllOrders);

/**
 * @swagger
 * /api/orders/order/{id}:
 *   get:
 *     summary: Get order details by ID (admin only)
 *     description: Retrieve a single order by its ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to retrieve
 *     responses:
 *       200:
 *         description: Order found and returned
 *       400:
 *         description: Invalid order ID
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/orders/:id', getOrderById);
// router.get('/orders/:identifier', getOrderByIdentifier);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update the shipping status of an order (admin only)
 *     description: Update shipping status (Pending, Shipped, Delivered, Cancelled)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New shipping status
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status or input
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/orders/:id/status', protectAdmin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order (admin only)
 *     description: Cancel an order unless it is already shipped or delivered
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID to cancel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be canceled if shipped or delivered
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/orders/:id/cancel', protectAdmin, cancelOrder);

/**
 * @swagger
 * /api/orders/remove-order/{id}:
 *   delete:
 *     summary: Delete an order permanently (admin only)
 *     description: Remove order from database
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/orders/remove-order/:id', protectAdmin, deleteOrder);
export default router;
