import express from "express";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ecommerce AI Engine API Running");
});

app.use("/api/auth", authRoutes);

export default app;