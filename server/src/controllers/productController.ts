import { Request, Response } from "express";
import Product from "../models/product";
import redisClient from "../config/redis";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.create(req.body);

    await redisClient.del("products");
    console.log("Redis cache cleared after create");

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, keyword, page = "1", limit = "5" } = req.query;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (keyword) {
      query.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const cacheKey = `products:${category || "all"}:${keyword || "none"}:${page}:${limit}`;

    // check redis cache
    const cachedProducts = await redisClient.get(cacheKey);

    if (cachedProducts) {
      console.log("Serving from Redis Cache");
      res.status(200).json(JSON.parse(cachedProducts));
      return;
    }

    const products = await Product.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    await redisClient.setEx(
      cacheKey,
      60,
      JSON.stringify(products)
    );

    console.log("Serving from MongoDB");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
      }
    );

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    // clear redis cache
    await redisClient.del("products");
    console.log("Redis cache cleared after update");

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    // clear redis cache
    await redisClient.del("products");
    console.log("Redis cache cleared after delete");

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};