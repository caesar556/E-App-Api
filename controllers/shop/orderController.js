import { errorHandler } from "../../middleware/errorHandler.js";
import Order from "../../models/shop/orderModel.js";
import { SUCCESS } from "../../utils/httpStatus.js";
import { getAllDoc, deleteDoc } from "../factoryController.js";


export const createOrder = errorHandler(
  async (req, res) => {
    const { userId, amount, items, shippingAdderss } = req.body;
    console.log("userId", req.user._id);
    const order = await Order.create({
      userId: req.user._id,
      amount,
      items,
      shippingAdderss,
      status: "pending"
    });

    res.status(200).json({
      status: SUCCESS,
      order
    });

  }
)


export const getAllOrder = getAllDoc(Order);

export const deleteOrder = deleteDoc(Order);
