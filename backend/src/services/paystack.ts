import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_URL = "https://api.paystack.co";

export const createTransaction = async (email: string, amount: number) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_URL}/transaction/initialize`,
      { email, amount, channels: ["card"] },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Paystack Error: ${error}`);
  }
};

export const verifyTransaction = async (reference: string) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Paystack Error: ${error}`);
  }
};
