import { Router } from "express";
import { signup, login, sendOTP } from "../controllers/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOTP);

export default router;
