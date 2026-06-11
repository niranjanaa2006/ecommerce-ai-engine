import { Request, Response } from "express";
import Product from "../models/product";

export const getRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.body;

    const products = await Product.find({ category });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};