import { errorHandler } from '../../middleware/errorHandler.js';
import express from 'express';
import AppError from '../../utils/appError.js';
import { Cart } from '../../models/shop/cartModel.js';
import { Product } from '../../models/shop/productModel.js';
import { User } from '../../models/userModel.js';
import { SUCCESS } from '../../utils/httpStatus.js';

export const getCart = errorHandler(
  async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }
    res.status(200).json({
      status: SUCCESS,
      data: cart
    })
  }
);

export const clearCart = errorHandler(
  async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
      return next(new AppError('Sorry user not found', 404));
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(new AppError('Sorry cart not found', 404));
    }
    cart.items = [];

    await cart.save();

    res.status(200).json({
      status: SUCCESS,
      message: "Cart cleared successfully "
    })
  }
);

export const addToCart = errorHandler(
  async (req, res, next) => {
    const userId = req.user._id;

    const { productId, quantity } = req.body;

    const existProduct = await Product.findById(productId);

    if (!existProduct) {
      return next(new AppError("product not found", 404));
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({
      status: SUCCESS,
      message: "Product added to cart",
      data: cart
    })
  }
);


export const removeFromCart = errorHandler(
  async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return next(new AppError("Cart not found", 404));

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    
    await cart.save();
    
    res.status(200).json({
      status: SUCCESS,
      message: "Product removed from cart",
      data: cart
    })

  }
);