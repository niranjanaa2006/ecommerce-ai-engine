import express from "express";
import {
  addToCart,
  getCartTotal,
  purchaseCart
} from "../controllers/cartcontrollers";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Protected Cart Routes
router.post("/", protect, addToCart);

// Get cart total
router.get("/:userId", protect, getCartTotal);

// Purchase cart
router.post("/purchase/:userId", protect, purchaseCart);

export default router;