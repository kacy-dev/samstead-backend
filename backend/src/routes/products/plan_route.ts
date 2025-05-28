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
} from '../../controllers/products/plan_controller';
import { protectAdmin } from '../../middlewares/auth_middleware';

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

export default router;
