import { Router } from "express";
import {
  createCategory,
  editCategory,
  deleteCategory,
  fetchCategories,
} from "../controllers/categories";

const router = Router();

router.post("/create-category", createCategory);
router.put("/edit-category", editCategory);
router.delete("/delete-category", deleteCategory);
router.get("/fetch-categories", fetchCategories);

export default router;
