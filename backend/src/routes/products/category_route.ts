import express from 'express';
import upload from '../../middlewares/multer_middleware';
import {
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  getActiveCategories, // renamed from getFeaturedCategories
} from '../../controllers/products/category_controller';
import { protectAdmin } from '../../middlewares/auth_middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management routes
 */

/**
 * @swagger
 * /api/addCategory:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 */
router.post('/addCategory', upload.single('image'), protectAdmin, createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Internal server error
 */
router.get('/categories', getAllCategories);

/**
 * @swagger
 * /api/category/active:
 *   get:
 *     summary: Get all active categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of active categories
 *       500:
 *         description: Internal server error
 */
router.get('/active', getActiveCategories);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get('/category/:id', getCategoryById);

/**
 * @swagger
 * /api/category/updateCategory/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateCategory/:id', upload.single('image'), protectAdmin, updateCategory);

/**
 * @swagger
 * /api/category/removeCategory/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Cannot delete category with products
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete('/removeCategory/:id', protectAdmin, deleteCategory);

export default router;
