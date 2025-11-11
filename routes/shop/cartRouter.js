import express from 'express';
import {
  addToCart,
  getCart,
  clearCart,
  removeFromCart
} from '../../controllers/shop/cartController.js';

import { protect } from '../../controllers/authController.js';

const router = express.Router();

router.use(protect)

router.route('/')
  .post(addToCart)
  .get(getCart)
  .delete(clearCart)

router.route('/:productId')
  .delete(removeFromCart)



export const cartRouter = router;