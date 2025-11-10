import express from 'express';
import {
  addToCart,
  getCart,
  clearCart
} from '../../controllers/shop/cartController.js';

import { protect } from '../../controllers/authController.js';

const router = express.Router();

router.use(protect)

router.route('/')
  .post(addToCart)
  .get(getCart)
  .delete(clearCart)



export const cartRouter = router;