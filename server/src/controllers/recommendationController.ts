import { Request, Response } from "express";
import Product from "../models/product";
import UserActivity from "../models/userActivity";


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


export const getUserRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // get all viewed products by user
    
      const activities = await UserActivity.find({userId,
      action: "view",
    }).populate("productId");

    if (activities.length === 0) {
      res.status(404).json({
        message: "No activity found for user",
      });
      return;
    }

    // count categories
    const categoryCount: any = {};

    activities.forEach((activity: any) => {
      const product = activity.productId;

      if (product?.category) {
        categoryCount[product.category] =
          (categoryCount[product.category] || 0) + 1;
      }
    });

    // find favorite category
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    // recommend products from favorite category
    const recommendations = await Product.find({
      category: favoriteCategory,
    }).limit(5);

    res.status(200).json({
      favoriteCategory,
      recommendations,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};