import express from 'express';
import {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductsByCategories
} from '../../controllers/shop/productController.js';
//import upload from "../../middleware/multer.js";

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(
    (req, res, next) => {
      next();
    },
    createProduct
  );

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.route('/category/:slug').get(getProductsByCategories);

export const productRouter = router;