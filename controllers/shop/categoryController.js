import {
  createDoc,
  deleteDoc,
  updateDoc,
  getAllDoc,
  getSingleDoc
} from '../factoryController.js';

import { Category } from '../../models/shop/categoryModel.js';


export const getAllCategorys = getAllDoc(Category);

export const getSingleCategory = getSingleDoc(Category);

export const updateCategory = updateDoc(Category);

export const createCategory = createDoc(Category);

export const deleteCategory = deleteDoc(Category);