import express from 'express';
import {
  initiatePayment,
  cancelPayment,
  paystackWebhook,
} from '../../controllers/payment/onboarding_plan_payment';
import { ensureVerified, ensurePlanSelected } from '../../middlewares/protect_steps';
import { verifyPaystackSignature } from '../../middlewares/verify_webHook';

const router = express.Router();

/**
 * @swagger
 * /api/payment/initiate:
 *   post:
 *     summary: Initiate payment for a selected subscription plan
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment initiation successful
 *       403:
 *         description: Subscription plan not selected
 *       500:
 *         description: Internal server error
 */
router.post('/initiate-payment', ensureVerified, ensurePlanSelected, initiatePayment);

/**
 * @swagger
 * /api/payment/cancel:
 *   post:
 *     summary: Cancel an ongoing payment and clear stored references
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment process cancelled
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/cancel-payment', ensureVerified, cancelPayment);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Paystack webhook to verify payment success
 *     tags: [Payment]
 *     requestBody:
 *       description: Paystack webhook payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       500:
 *         description: Server error while processing webhook
 */
router.post('/verify-webhook', verifyPaystackSignature, paystackWebhook);

export default router;
