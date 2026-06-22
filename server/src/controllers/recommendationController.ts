import { Request, Response } from "express";
import Product from "../models/product";
import UserActivity from "../models/userActivity";
import redisClient from "../config/redis";

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
      _id: { $ne: productId }, // exclude current product
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

    // redis cache key
    const cacheKey = `recommendations:${userId}`;

    // check redis cache first
    const cachedRecommendations = await redisClient.get(cacheKey);

    if (cachedRecommendations) {
      console.log("Serving Recommendations from Redis");

      res.status(200).json(
        JSON.parse(cachedRecommendations)
      );
      return;
    }

    // get all user activities
    const activities = await UserActivity.find({
      userId,
    }).populate("productId");

    if (activities.length === 0) {
      res.status(404).json({
        message: "No activity found for user",
      });
      return;
    }

    // category score count
    const categoryCount: any = {};

    activities.forEach((activity: any) => {
      const product = activity.productId;

      let score = 0;

      if (activity.action === "view") {
        score = 1;
      } else if (activity.action === "click") {
        score = 2;
      } else if (activity.action === "purchase") {
        score = 5;
      }

      if (product?.category) {
        categoryCount[product.category] =
          (categoryCount[product.category] || 0) + score;
      }
    });

    // find favorite category
    const favoriteCategory = Object.keys(categoryCount).reduce(
      (a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
    );

    // recommend best products from favorite category
    const recommendations = await Product.find({
      category: favoriteCategory,
      isAvailable: true,
    })
      .sort({ rating: -1 }) // highest rating first
      .limit(5);

    const responseData = {
      favoriteCategory,
      recommendations,
    };

    // save recommendations in redis
    await redisClient.setEx(
      cacheKey,
      60,
      JSON.stringify(responseData)
    );

    console.log("Serving Recommendations from MongoDB");

    res.status(200).json(responseData);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};