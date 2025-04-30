import { Router } from "express";
import {
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/products";

const router = Router();

router.post("/create-product", createProduct);
router.put("/edit-product/:productId", editProduct);
router.delete("/delete-product/:productId", deleteProduct);

export default router;
