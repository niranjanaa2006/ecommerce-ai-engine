import { Request, Response } from "express";
import Cart from "../models/cart";
import Product from "../models/product";

// Add to Cart
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

// Get Cart Total
export const getCartTotal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // get cart items
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

    // calculate total
    cartItems.forEach((item: any) => {
      const product = item.productId;
      totalAmount += product.price * item.quantity;
    });

    // discount rules
    let discount = 0;

    if (totalAmount > 100000) {
      discount = totalAmount * 0.20;
    } else if (totalAmount > 50000) {
      discount = totalAmount * 0.10;
    }

    const finalAmount = totalAmount - discount;

    res.status(200).json({
      cartItems,
      totalAmount,
      discount,
      finalAmount,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Purchase Cart
export const purchaseCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // get cart items
    const cartItems = await Cart.find({
      userId,
    }).populate("productId");

    if (cartItems.length === 0) {
      res.status(404).json({
        message: "Cart is empty",
      });
      return;
    }

    // check stock + update inventory safely
    for (const item of cartItems as any[]) {
      const product = item.productId;

      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
        return;
      }

      // atomic stock decrement
      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: { stock: -item.quantity },
        }
      );
    }

    // clear cart
    await Cart.deleteMany({ userId });

    res.status(200).json({
      message: "Purchase successful",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};