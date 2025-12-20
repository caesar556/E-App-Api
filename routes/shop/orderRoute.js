import express from 'express';
import { createOrder, getAllOrder } from "../../controllers/shop/orderController.js";
import { protect } from "../../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getAllOrder)




export const orderRouter = router;