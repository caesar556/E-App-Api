import { errorHandler } from "../../middleware/errorHandler.js";
import Order from "../../models/shop/orderModel.js";
import { SUCCESS } from "../../utils/httpStatus.js";
import { getAllDoc, deleteDoc } from "../factoryController.js";


export const createOrder = errorHandler(async (req, res) => {
  const {  items, shippingAdderss } = req.body;
  const orderItems = items.map(cartItem => ({
    productId: cartItem.product._id,
    name: cartItem.product.title,
    price: cartItem.product.price,
    qty: cartItem.quantity,
  }));

  const amount = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    amount,
    shippingAdderss,
    status: "pending",
  });

  res.status(201).json({
    status: SUCCESS,
    data: order
  });
});


export const getAllOrder = getAllDoc(Order);

export const deleteOrder = deleteDoc(Order);
