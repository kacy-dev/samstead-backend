import { Request, Response } from "express";

import { Category } from "../models/categories.model";

/**
 * @swagger
 * /create-category:
 *   post:
 *     summary: Create a top-level category
 *     description: This endpoint is used for creating a top-level category e.g Food, Fruit, Vegetables.
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
 *     responses:
 *       201:
 *         description: Category Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Created Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error creating category
 *       500:
 *         description: Internal server error
 */
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    throw new Error("Category name is required");
  }

  try {
    const newCategory = new Category({ name });

    await newCategory.save();

    res.status(201).json({ message: "Category Created Successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /edit-category:
 *   put:
 *     summary: Edit a category
 *     description: This endpoint is used for editing a category.
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
 *               categoryId:
 *                 type: ObjectId
 *                 example: 680f59c92675fa9d8855982d
 *     responses:
 *       200:
 *         description: Category Edited Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Edited Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error editing category
 *       500:
 *         description: Internal server error
 */
export const editCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!name || !category) {
      throw new Error("Category and name not found");
    }

    category.name = name || category.name;
    await category.save();

    res.status(200).json({ message: "Category Edited Successfully" });
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /delete-category:
 *   delete:
 *     summary: Delete a category
 *     description: This endpoint is used for deleting a category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: ObjectId
 *                 example: 680f59c92675fa9d8855982d
 *     responses:
 *       200:
 *         description: Category Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Deleted Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error deleting category
 *       500:
 *         description: Internal server error
 */
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.body;

  if (!categoryId) {
    throw new Error("Category id not found");
  }

  try {
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /fetch-categories:
 *   get:
 *     summary: Fetch all the available categories
 *     description: This endpoint is used for fetching all the available categories.
 *     responses:
 *       200:
 *         description: Categories Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Fetched Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error fetching category
 *       500:
 *         description: Internal server error
 */
export const fetchCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find({});

    res
      .status(200)
      .json({ message: "Category fetched Successfully", data: categories });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
