import { Request, Response } from "express";
import Cart from "../models/cart";
import Product from "../models/product";

export const addToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    // check product exists
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    // create cart item
    const cartItem = await Cart.create({
      userId,
      productId,
      quantity,
    });

    res.status(201).json({
      message: "Product added to cart",
      cartItem,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getCartTotal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // get all cart items for user
    const cartItems = await Cart.find({
      userId,
    }).populate("productId");

    if (cartItems.length === 0) {
      res.status(404).json({
        message: "Cart is empty",
      });
      return;
    }

    let totalAmount = 0;

    cartItems.forEach((item: any) => {
      const product = item.productId;

      totalAmount += product.price * item.quantity;
    });

    res.status(200).json({
      cartItems,
      totalAmount,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};