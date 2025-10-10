import express from 'express';
import {
  addToCart,
} from '../../controllers/shop/cartController.js';

import { protect } from '../../controllers/authController.js';

const router = express.Router();



router.route('/add-cart')
  .post(addToCart)

export const cartRouter = router;