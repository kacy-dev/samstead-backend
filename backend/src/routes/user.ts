import { Router } from "express";

import { editProfile, fetchUser } from "../controllers/user";

const router = Router();

router.put("/edit-profile/:userId", editProfile);
router.post("/fetch-user", fetchUser);

export default router;
