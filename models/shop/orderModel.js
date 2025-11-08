import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"]
    },
    items: [
      {
        productId: String,
        name: String,
        qty: Number,
        price: Number
      }
    ],
    amount : Number,
    shippingAdderss: String,
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    paymentMethod: {
      method: String,
      transactionId: String
    }
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;