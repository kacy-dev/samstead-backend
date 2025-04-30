import { Request, Response } from "express";

import { User } from "../models/user.model";

/**
 * @swagger
 * /edit-profile:
 *   put:
 *     summary: Edit a user's profile
 *     description: This endpoint is used for editing a user's profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: ObjectId
 *                 example: 4797hf087e0fjh48
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email
 *                 type: string
 *                 example: johndoe@gmail.com
 *               phoneNumber
 *                  type: number
 *                  example: 0123456789
 *               deliveryAddress
 *                  type: string
 *                  example: third mainland bridge
 *     responses:
 *       200:
 *         description: User Profile Edited Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Profile Edited Successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request - Error editing profile
 *       500:
 *         description: Internal server error
 */
export const editProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, phoneNumber, deliveryAddress } = req.body;
  const { id } = req.body;

  if (!id) {
    throw new Error("401 Unauthorized");
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.deliveryAddress = deliveryAddress || user.deliveryAddress;

      await user.save();

      res.status(200).json({ message: "User Profile Edited Successfully" });
    }
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
