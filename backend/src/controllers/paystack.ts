import { Request, Response } from "express";

import { User, Order } from "../models/user.model";
import { createTransaction, verifyTransaction } from "../services/paystack";

/**
 * @swagger
 * /initialize:
 *   post:
 *     summary: Initialize a paystack transaction
 *     description: This endpoint allows a user to initialize payments using paystack.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               amount:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       200:
 *         description: Payment Initialized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment successfully initialized"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error initializing payment
 *       500:
 *         description: Internal server error
 */
export const initialize = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    throw new Error("Email and amount are required");
  }

  try {
    const result = await createTransaction(email, amount);

    res
      .status(200)
      .json({ message: "Payment successfully initialized", result });
  } catch (error) {
    console.error("Error during payment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /verify/{reference}:
 *   get:
 *     summary: Verify a paystack transaction
 *     description: This endpoint verifies payments made using paystack.
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         description: The reference of the initialized transaction
 *         schema:
 *           type: string
 *         example: 268hde768n
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *                 example: "683jnbid80"
 *     responses:
 *       200:
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment successful"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - error verifying payment
 *       500:
 *         description: Internal server error
 */
export const verify = async (req: Request, res: Response): Promise<void> => {
  const { reference } = req.params;
  const { category, id, orderId, product } = req.body;

  if (!reference) {
    throw new Error("Transaction reference is required");
  }

  try {
    if (category && id) {
      const result = await verifyTransaction(reference);

      if (category === "cart") {
        const user = await User.findById(id);

        if (!Array.isArray(product) || product.length === 0) {
          throw new Error(
            "Products are required and must be a non-empty array"
          );
        }

        const validProducts = product
          .filter(
            (p: any) =>
              p._id && typeof p.quantity === "number" && p.quantity > 0
          )
          .map((p: any) => ({
            productId: p._id,
            quantity: p.quantity,
          }));

        if (validProducts.length !== product.length) {
          throw new Error("One or more products are missing quantity or _id");
        }

        if (!orderId) {
          throw new Error("orderId is required");
        }

        const order: Order = {
          orderId,
          products: validProducts,
          status: "pending",
          orderDate: new Date(),
        };

        user?.orders.push(order);

        await user?.save();

        res.status(200).json({ message: "Payment successful", result });
      } else if (category === "subs") {
        res.status(200).json({ message: "Payment successful", result });
      }
    } else {
      res.status(404).json({ message: "Category and ID not found" });
    }
  } catch (error) {
    console.error("Error during payment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
