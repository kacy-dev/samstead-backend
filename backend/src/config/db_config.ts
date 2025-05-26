import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const DB_URL = process.env.DB_URL || "";

const mongoDBConnection = async () => {
   await mongoose.connect(DB_URL).then(() => {
        console.log("MongoDB connected...")
    }).catch((err) => {
        console.error("Mongodb error", err);
        
    })
}

export default mongoDBConnection;
