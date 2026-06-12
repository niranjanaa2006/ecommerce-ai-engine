import express from "express";
import { trackActivity } from "../controllers/activityController";

const router = express.Router();

router.post("/", trackActivity);

export default router;