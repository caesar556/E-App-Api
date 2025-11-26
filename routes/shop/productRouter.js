import express from 'express';
import {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductsByCategories
} from '../../controllers/shop/productController.js';
import upload from "../../middleware/multer.js";

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 4 }
    ]),
    (req, res, next) => {
      console.log("Before body parse");
      console.log(req.body);
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