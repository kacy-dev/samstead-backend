import { Router } from "express";
import {
  signup,
  login,
  sendOTP,
  verifyOTP,
  verify,
  setNewPassword,
} from "../controllers/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify", verify);
router.post("/verify-otp", verifyOTP);
router.post("/set-new-password", setNewPassword);

export default router;
