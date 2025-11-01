import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import AppError from "../utils/appError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new AppError("Only image files allowed", 400), false);
  }
});

export const uploadToCloudinary = async (localFilePath) => {
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder: "profile-images"
  });
  fs.unlinkSync(localFilePath);
  return result.secure_url;
};

export default upload;