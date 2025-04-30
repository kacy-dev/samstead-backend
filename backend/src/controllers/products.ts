import { Request, Response } from "express";

import { Category } from "../models/categories.model";
import { Product } from "../models/products.model";

/**
 * @swagger
 * /create-product:
 *   post:
 *     summary: Create a product
 *     description: This endpoint is used for creating a product inside a category like the food category e.g Eba, Egusi, Afang.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: food
 *               price:
 *                 type: number
 *                 example: 10000
 *               description:
 *                 type: string
 *                 example: this is product description
 *               categoryId:
 *                 type: ObjectId
 *                 example: 680f59c92675fa9d8855982d
 *     responses:
 *       200:
 *         description: Product Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Created Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error creating product
 *       500:
 *         description: Internal server error
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, price, description, categoryId } = req.body;

  if (!name || !price || !description || !categoryId) {
    throw new Error("Category name, price, description and id are required");
  }

  try {
    const newProduct = new Product({ name, price, description, categoryId });

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error("Category Not Found");
    }

    // @ts-ignore
    category.products.push(newProduct._id);

    await category.save();
    await newProduct.save();

    res.status(201).json({ message: "Product Created Successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /edit-product/{productId}:
 *   put:
 *     summary: Edit a product
 *     description: This endpoint is used to edit a product.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to edit
 *         schema:
 *           type: string
 *         example: 680f59c92675fa9d8855982d
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Food"
 *               price:
 *                 type: number
 *                 example: 15.99
 *               description:
 *                 type: string
 *                 example: "A delicious meal"
 *     responses:
 *       200:
 *         description: Product Edited Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Edited Successfully"
 *       400:
 *         description: Bad request - Missing required fields
 *       404:
 *         description: Product Not Found
 *       500:
 *         description: Internal server error
 */
export const editProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, price, description } = req.body;
  const { productId } = req.params;

  if (!name || !price || !description) {
    throw new Error("Category name, price, description and id are required");
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product Not Found");
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;

    await product.save();

    res.status(200).json({ message: "Product Edited Successfully" });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /delete-product/{productId}:
 *   delete:
 *     summary: Delete a product
 *     description: This endpoint is used for deleting a product.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *         example: 680f59c92675fa9d8855982d
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Product Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Deleted Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error deleting product
 *       500:
 *         description: Internal server error
 */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId } = req.params;

  if (!productId) {
    throw new Error("Product id is required");
  }

  try {
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
