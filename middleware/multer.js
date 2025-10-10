import multer from 'multer';
import path from 'path';
import AppError from '../utils/appError.js';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
    cb(null, true);
  } else {
    cb(new AppError('only images are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

export default upload;