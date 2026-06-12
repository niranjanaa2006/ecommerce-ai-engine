import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import activityRoutes from "./routes/activityRoutes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("ROOT ROUTE HIT");
  res.send("Ecommerce AI Engine API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/activity", activityRoutes);

export default app;