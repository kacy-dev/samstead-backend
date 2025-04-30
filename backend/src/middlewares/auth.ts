import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // @ts-ignore

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore

  if (!req.user)
    return res.status(403).json({ message: "User not Authenticated" });
  next();
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore

  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  next();
};
