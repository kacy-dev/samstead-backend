import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const config: CloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_NAME || '',
  api_key: process.env.CLOUDINARY_KEY || '',
  api_secret: process.env.CLOUDINARY_SECRET_KEY || '',
};

cloudinary.config(config);

export default cloudinary;
