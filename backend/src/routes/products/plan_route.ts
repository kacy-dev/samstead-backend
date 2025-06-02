/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Admin operations for managing subscription plans
 */

import express from 'express';
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  selectSubscriptionPlan
} from '../../controllers/products/plan_controller';
import { protectAdmin } from '../../middlewares/auth_middleware';
import { protectUser } from '../../middlewares/user_auth_middleware';
import { ensureVerified } from '../../middlewares/protect_steps';
const router = express.Router();

/**
 * @swagger
 * /api/create:
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - prices
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               prices:
 *                 type: object
 *                 properties:
 *                   monthly:
 *                     type: number
 *                   yearly:
 *                     type: number
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', protectAdmin, createPlan);

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of all plans
 */
router.get('/plans', getAllPlans);

/**
 * @swagger
 * /api/single-plan/{planId}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the plan
 *     responses:
 *       200:
 *         description: Plan found
 *       404:
 *         description: Plan not found
 */
router.get('/single-plan/:planId', getPlanById);

/**
 * @swagger
 * /api/update-plan/{planId}:
 *   put:
 *     summary: Update a plan
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               prices:
 *                 type: object
 *                 properties:
 *                   monthly:
 *                     type: number
 *                   yearly:
 *                     type: number
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 */
router.put('/update-plan/:planId', protectAdmin, updatePlan);

/**
 * @swagger
 * /api/delete-plan/{planId}:
 *   delete:
 *     summary: Delete a plan
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted
 *       404:
 *         description: Plan not found
 */
router.delete('/delete-plan/:planId', protectAdmin, deletePlan);

// user Route to manage plan selection

/**
 * @swagger
 * /api/subscription/select-plan:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Select a subscription plan
 *     description: Allows a verified user to select a subscription plan before proceeding to payment.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 description: The ID of the selected subscription plan
 *                 example: 64f1c354f17a913dbb3e53e7
 *     responses:
 *       200:
 *         description: Plan selected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan selected successfully. Proceed to payment.
 *       400:
 *         description: Missing planId in request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 4001
 *                 message:
 *                   type: string
 *                   example: Please select a plan to continue.
 *       401:
 *         description: User not found or not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 4011
 *                 message:
 *                   type: string
 *                   example: User not found or not verified.
 *       500:
 *         description: Server error during plan selection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 5000
 *                 message:
 *                   type: string
 *                   example: Could not select plan. Please try again.
 */

router.post('/select-plan', ensureVerified, selectSubscriptionPlan)

export default router;
