import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Not authorized",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Token missing",
    });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};