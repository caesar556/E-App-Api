import { User } from '../models/userModel.js';
import {
  createDoc,
  deleteDoc,
  updateDoc,
  getAllDoc,
  getSingleDoc
} from './factoryController.js';

import { SUCCESS } from '../utils/httpStatus.js';

import AppError from '../utils/appError.js';



import { errorHandler } from '../middleware/errorHandler.js';

export const createUser = createDoc(User);

export const getOneUser = getSingleDoc(User);

export const deleteUser = deleteDoc(User);

export const updateUser = updateDoc(User);

export const getAllUsers = getAllDoc(User);

