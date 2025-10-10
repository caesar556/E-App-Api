import express from 'express';
import {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductsByCategories
} from '../../controllers/shop/productController.js';

const router = express.Router();

router.route('/')
  .post(createProduct)
  .get(getAllProducts)

router.route('/:id')
  .get(getSingleProduct)
  .delete(deleteProduct)

router.route('/category/:slug')
  .get(getProductsByCategories)

export const productRouter = router;