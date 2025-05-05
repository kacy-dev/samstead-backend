import { Request, Response } from "express";

import { User } from "../models/user.model";

/**
 * @swagger
 * /edit-profile/{id}:
 *   put:
 *     summary: Edit a user's profile
 *     description: This endpoint is used for editing a user's profile.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to edit
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: "johndoe@mail.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "0123456789"
 *               deliveryAddress:
 *                 type: string
 *                 example: "Third Mainland Bridge"
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 680f59c92675fa9d8855982d
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@mail.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     deliveryAddress:
 *                       type: string
 *                       example: "Third Mainland Bridge"
 *       400:
 *         description: Bad request - Error editing profile
 *       500:
 *         description: Internal server error
 */
export const editProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, phoneNumber, deliveryAddress, country } = req.body;
  const { userId } = req.params;

  if (!userId) {
    throw new Error("401 Unauthorized");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.deliveryAddress = deliveryAddress || user.deliveryAddress;
      user.country = country || user.country;

      await user.save();

      res.status(200).json({ message: "User Profile Edited Successfully" });
    }
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @swagger
 * /fetch-profile:
 *   get:
 *     summary: Fetch a user's profile
 *     description: This endpoint is used for fetching a user's profile.
 *     responses:
 *       200:
 *         description: User Profile Fetched Successfully
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 680f59c92675fa9d8855982d
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@mail.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     deliveryAddress:
 *                       type: string
 *                       example: "Third Mainland Bridge"
 *       400:
 *         description: Bad request - Error fetching profile
 *       500:
 *         description: Internal server error
 */
export const fetchUser = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { userId } = req.params;

  if (!userId) {
    throw new Error("401 Unauthorized");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({ message: "Error Fetching Profile" });
    } else {
      res
        .status(200)
        .json({ message: "User Profile Fetched Successfully", data: user });
    }
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
