import express from 'express';
import { createOrder } from "../../controllers/shop/orderController.js";

const router = express.Router();


router.route('/create')
  .post(createOrder)


export const orderRouter = router;