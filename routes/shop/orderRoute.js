import express from 'express';
import { createOrder, getAllOrder, deleteOrder } from "../../controllers/shop/orderController.js";
import { protect } from "../../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getAllOrder)


router.route('/:id')
   .delete(deleteOrder)



export const orderRouter = router;