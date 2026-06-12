import express from "express";
import {
  getRecommendations,
  getUserRecommendations,
} from "../controllers/recommendationController";


const router = express.Router();

router.get("/:productId", getRecommendations);
router.get("/user/:userId", getUserRecommendations);

export default router;