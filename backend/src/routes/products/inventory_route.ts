import express from 'express';

const {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    updateStock,
} = require('../../controllers/products/inventory_controller');
const { protectAdmin } = require('../../middlewares/auth_middleware');

const router = express.Router();

// Create a new inventory item
/**
 * @swagger
 * /api/create-inventory:
 *   post:
 *     summary: Add a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryCreate'
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 */
router.post('/create-inventory', protectAdmin, createInventory);

// Get all inventory items with pagination
/**
 * @swagger
 * /api/inventories:
 *   get:
 *     summary: Get all grocery inventory items with pagination
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of grocery inventory items with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       401:
 *         description: Unauthorized access
 */
router.get('/inventories', protectAdmin, getAllInventory);

// Get a single inventory item by ID
/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get a single inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory item not found
 *       401:
 *         description: Unauthorized access
 */
router.get('/inventory/:id', protectAdmin, getInventoryById);

// Update an inventory item
/**
 * @swagger
 * /api/update-inventory/{id}:
 *   put:
 *     summary: Update inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryUpdate'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory item not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 */
router.put('/update-inventory/:id', protectAdmin, updateInventory);

// Delete an inventory item
/**
 * @swagger
 * /api/delete-inventory/{id}:
 *   delete:
 *     summary: Delete a inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 *       401:
 *         description: Unauthorized access
 */
router.delete('/delete-inventory/:id', protectAdmin, deleteInventory);

// Update stock for an inventory item
/**
 * @swagger
 * /api/update-stock/{id}:
 *   patch:
 *     summary: Update stock quantity for a inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantity to reduce from stock
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Insufficient stock or validation error
 *       404:
 *         description: Inventory item not found
 *       401:
 *         description: Unauthorized access
 */
router.patch('/update-stock/:id', protectAdmin, updateStock);

module.exports = router;
