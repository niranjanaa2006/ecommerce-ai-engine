import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";   // added

interface AuthRequest extends Request {
  user?: any;   // changed from string → any
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Not authorized",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  // keep debug logs for now
  console.log("AUTH HEADER =", authHeader);
  console.log("TOKEN =", token);
  console.log("JWT SECRET =", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(
      token as string,
      String(process.env.JWT_SECRET)
    ) as any;

    // NEW: fetch full user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    // save full user object (id + role + email ...)
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};