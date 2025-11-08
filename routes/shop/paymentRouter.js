import express from 'express';
import { checkout } from "../../controllers/shop/paymentController.js";

const router = express.Router();

router.route('/checkout')
  .post(checkout)
  

export const paymentRouter = router;