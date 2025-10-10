import express from 'express';
import {
  getAllCategorys,
  getSingleCategory,
  updateCategory,
  createCategory,
  deleteCategory
} from '../../controllers/shop/categoryController.js';

const router = express.Router();

router.route('/')
  .get(getAllCategorys)
  .post(createCategory)

router.route('/:id')
  .get(getSingleCategory)
  .delete(deleteCategory)


export const categoryRouter = router;