import { errorHandler } from "../../middleware/errorHandler.js";
import Stripe from "stripe";
import Order from "../../models/shop/orderModel.js";
import { SUCCESS } from "../../utils/httpStatus.js";
import AppError from "../../utils/appError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const checkout = errorHandler(
  async (req, res, next) => {
    const { orderId } = req.body;

    if (!orderId) {
      return next(new AppError("order id is requird"), 401);
    }

    const order = await Order.findById(orderId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map(item => ({
        price_data: {
          currency: "egp",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.qty
      })),
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: { orderId: order._id.toString() }
    });

    res.status(200).json({
      status: SUCCESS,
      url: session.url
    });

  }
);


export const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig
    );

  } catch (err) {
    console.log("❌ Invalid signature");
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const orderId = session.metadata.orderId;
    const paymentIntent = session.payment_intent;

    await Order.findByIdAndUpdate(orderId, {
      status: "paid",
      paymentInfo: {
        transactionId: paymentIntent,
        method: "Stripe",
      }
    });

    console.log("✅ Order updated to PAID");
  }

  res.stauts(200).json({
    status: SUCCESS,
    received: true
  })
}
