import { Router } from "express";
import {
  createProduct,
  editProduct,
  deleteProduct,
  fetchProducts,
} from "../controllers/products";

const router = Router();

router.post("/create-product", createProduct);
router.put("/edit-product/:productId", editProduct);
router.delete("/delete-product/:productId", deleteProduct);
router.get("/fetch-products/:productId", fetchProducts);

export default router;
