import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import redisClient from "./config/redis";

dotenv.config();

connectDB();

redisClient.connect()
  .then(() => console.log("Redis Connected"))
  .catch((err) => console.error("Redis Connection Failed:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});