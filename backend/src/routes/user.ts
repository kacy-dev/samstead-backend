import { Router } from "express";
import { editProfile } from "../controllers/user";

const router = Router();

router.put("/edit-profile", editProfile);

export default router;
