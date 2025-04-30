import { Router } from "express";

import { initialize, verify } from "../controllers/paystack";

const router = Router();

router.post("/initialize", initialize);
router.put("/verify/:reference", verify);

export default router;
