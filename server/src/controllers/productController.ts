import { Request, Response } from "express";
import Product from "../models/product";
import redisClient from "../config/redis";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.create(req.body);

    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

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
  // TEMP TEST for global error middleware
  throw new Error("Testing global error middleware");

  try {
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "5";
    const sort = req.query.sort as string;

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

    let sortOption: any = {};

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    if (sort === "rating_desc") {
      sortOption = { rating: -1 };
    }

    const cacheKey: string = String(
      `products:${category || "all"}:${keyword || "none"}:${page}:${limit}:${sort || "none"}`
    );

    // check redis cache
    const cachedProducts = await redisClient.get(
      String(cacheKey)
    );
if (cachedProducts !== null) {
  console.log("Serving from Redis Cache");

  res.status(200).json(
    JSON.parse(String(cachedProducts))
  );

  return;
}
    const products = await Product.find(query)
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    await redisClient.setEx(
      String(cacheKey),
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
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

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
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

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

export const getProductCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await Product.countDocuments();

    res.status(200).json({
      totalProducts: count,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};