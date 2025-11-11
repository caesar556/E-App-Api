import { User } from '../models/userModel.js';
import {
  createDoc,
  deleteDoc,
  updateDoc,
  getAllDoc,
  getSingleDoc
} from './factoryController.js';

import { SUCCESS } from '../utils/httpStatus.js';

import upload from '../middleware/multer.js';

import AppError from '../utils/appError.js';

import { uploadToCloudinary } from "../middleware/multer.js";


import { errorHandler } from '../middleware/errorHandler.js';

export const createUser = createDoc(User);

export const getOneUser = getSingleDoc(User);

export const deleteUser = deleteDoc(User);

export const updateUser = updateDoc(User);

export const getAllUsers = getAllDoc(User);

export const uploadProfileImage = errorHandler(
  async (req, res, next) => {
    const singleUpload = upload.single('profileImage');

    singleUpload(req, res, async (err) => {
      console.log("file", req.file);
      if (err) return next(err);
      if (!req.file) return next(new AppError('Please upload an image file', 400));

      try {
        const imageUrl = await uploadToCloudinary(req.file.path);

        await User.findByIdAndUpdate(req.user._id, {
          profileImage: imageUrl,
        });


        res.status(200).json({
          status: SUCCESS,
          message: 'Image uploaded successfully',
          data: { imageUrl },
        });
      } catch (error) {
        next(error);
      }
    });
  });