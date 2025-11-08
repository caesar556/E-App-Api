import { errorHandler } from "../../middleware/errorHandler.js";
import Order from "../../models/shop/orderModel.js";
import { SUCCESS } from "../../utils/httpStatus.js"

export const createOrder = errorHandler(
  async (req, res) => {
    const { userId, amount, items, shippingAdderss } = req.body;

    const order = await Order.create({
      userId,
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