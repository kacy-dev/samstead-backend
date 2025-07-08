import express from 'express';
import {
  registerUser,
  loginUser,
  selectPlan,
  initializePayment,
  // paystackWebhook,
} from '../../controllers/auth/newUser_authController';
import { authGuard } from '../../middlewares/auth_Guard';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user registration and login
 *   - name: Plans
 *     description: Public subscription plans
 *   - name: Subscription
 *     description: Subscription lifecycle endpoints
 *   - name: Payment
 *     description: Paystack payment flow
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);


/**
 * @swagger
 * /api/plan/select:
 *   post:
 *     summary: Save selected plan (user must be authenticated)
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planId]
 *             properties:
 *               planId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan saved; returns payment options
 *       401:
 *         description: Unauthorized
 */
router.post('/plan/select', authGuard, selectPlan);

/**
 * @swagger
 * /api/payment/initialize:
 *   post:
 *     summary: Initialize Paystack payment (returns monthly & yearly URLs)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment URLs returned
 *       401:
 *         description: Unauthorized
 */
router.post('/payment/initialize', authGuard, initializePayment);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Paystack webhook (server → server)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Paystack event payload
 *     responses:
 *       200:
 *         description: Webhook processed
 */
// router.post('/payment/webhook', paystackWebhook);


export default router;
