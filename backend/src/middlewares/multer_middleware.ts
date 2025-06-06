// src/middlewares/multerMiddleware.ts
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary_config';

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
  }
};


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const ext = file.mimetype.split('/')[1]; // e.g. "png"
    return {
      folder: 'fashion',
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: 'image',
      format: ext,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter,
});

export default upload;
