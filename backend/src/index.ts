import express, { Application } from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/categories";
import paystackRoutes from "./routes/paystack";
import productRoutes from "./routes/products";
import userRoutes from "./routes/user";

import connectDB from "./db";
import { setupSwagger } from "./swagger";

dotenv.config();

connectDB();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/paystack", paystackRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);

setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
