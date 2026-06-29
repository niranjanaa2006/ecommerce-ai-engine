import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {

  console.log("USER DATA =", req.user);

  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      message: "Admin access only",
    });
    return;
  }

  next();
};