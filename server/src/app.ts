import express from "express";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import activityRoutes from "./routes/activityRoutes";
import cartRoutes from "./routes/cartRoutes";

const limiter = rateLimit({
  windowMs: 15* 60 * 1000,   // 15 minutes
  max: 100,                   // max 100 requests
  message: "Too many requests, try again later",
});

const app = express();

app.use(express.json());
app.use(limiter);

app.get("/", (req, res) => {
  console.log("ROOT ROUTE HIT");
  res.send("Ecommerce AI Engine API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/cart", cartRoutes);

export default app;