import { Request, Response } from "express";
import Product from "../models/product";

export const getRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;

    // find current product
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    // recommend similar category products
    const recommendations = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId },   // exclude current product
    }).limit(4);

    res.status(200).json({
      recommendedFor: currentProduct.name,
      recommendations,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};