import express from "express";
import {
  addToCart,
  getCartTotal
} from "../controllers/cartcontrollers";

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCartTotal);

export default router;