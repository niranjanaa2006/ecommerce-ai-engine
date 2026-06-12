import { Request, Response } from "express";
import UserActivity from "../models/userActivity";

export const trackActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, productId, action } = req.body;

    const activity = await UserActivity.create({
      userId,
      productId,
      action,
    });

    res.status(201).json({
      message: "Activity tracked",
      activity,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};