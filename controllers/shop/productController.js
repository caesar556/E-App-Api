import {
  createDoc,
  deleteDoc,
  updateDoc,
  getAllDoc,
  getSingleDoc,
  getDocsByField
} from '../factoryController.js';
import { Product } from '../../models/shop/productModel.js';
import { Category } from '../../models/shop/categoryModel.js'


export const getAllProducts = getAllDoc(Product);

export const getSingleProduct = getSingleDoc(Product);

export const updateProduct = updateDoc(Product);

export const createProduct = createDoc(Product);

export const deleteProduct = deleteDoc(Product);

export const getProductsByCategories = getDocsByField(Product, "category", Category, "_id", "slug");