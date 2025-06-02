import { Router } from 'express';
import { registerUser, verifyOtp, resendOtp, loginUser } from '../../controllers/auth/auth_controller';
import { checkOnboardingComplete } from '../../middlewares/protect_steps';
const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and send OTP for email verification
 *     tags:
 *       - Authentication
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
 *               - phoneNumber
 *               - deliveryAddress
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               phoneNumber:
 *                 type: string
 *                 example: 08012345678
 *               deliveryAddress:
 *                 type: string
 *                 example: 123 Banana Street, Lagos
 *     responses:
 *       200:
 *         description: User registered and OTP sent to email
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify user's OTP and activate account
 *     tags:
 *       - Authentication
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
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: OTP verified, account activated
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to user's email (limited to once per minute)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Too soon or user not found
 *       500:
 *         description: Server error
 */
router.post('/resend-otp', resendOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user after OTP verification and subscription completion
 *     tags:
 *       - Authentication
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
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful with token
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Account not verified or incomplete onboarding
 *       403:
 *         description: Account locked
 *       500:
 *         description: Server error
 */
router.post('/login', checkOnboardingComplete, loginUser);

export default router;
