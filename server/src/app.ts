import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ecommerce AI Engine API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;