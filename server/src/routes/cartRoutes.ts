import express from "express";
import {
  addToCart,
  getCartTotal,
  purchaseCart
} from "../controllers/cartcontrollers";

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCartTotal);
router.post("/purchase/:userId", purchaseCart );
export default router;