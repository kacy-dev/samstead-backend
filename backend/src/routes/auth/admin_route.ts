import express from 'express';
import upload from '../../middlewares/multer_middleware';
import {
  registerAdmin,
  verifyOTP,
  loginAdmin,
  getAdminDashboard,
  getAllUsers,
  deleteUserById,
  getUserById,
  updateUserById,
  createSettings,
  getSettings,
  updateSettings,
  getSettingsById,
} from '../../controllers/auth/admin_controller';
import { protectAdmin } from '../../middlewares/auth_middleware';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and authentication
 */

/**
 * @swagger
 * /api/auth/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/admin/register', registerAdmin);

/**
 * @swagger
 * /api/auth/admin/verify-otp:
 *   post:
 *     summary: Verify OTP for admin account
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       401:
 *         description: Invalid OTP
 */
router.post('/admin/verify-otp', verifyOTP);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/admin/login', loginAdmin);

/**
 * @swagger
 * /api/auth/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard (Protected)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/users', getAllUsers);
router.delete('/admin/users/:id', protectAdmin, deleteUserById);
router.get('/admin/users/:id', protectAdmin, getUserById);
router.patch("/admin/users/:id", protectAdmin, updateUserById);
router.get('/admin/app-data', getSettings);
router.get('/admin/app-data/:id', getSettingsById);
router.patch('/admin/app-data', protectAdmin, upload.single('appLogo'), createSettings);
router.put('/admin/app-data/:id', protectAdmin, upload.single('appLogo'), updateSettings);
/**
 * @swagger
 * /api/auth/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard (Protected)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/dashboard', protectAdmin, getAdminDashboard);

export default router;
