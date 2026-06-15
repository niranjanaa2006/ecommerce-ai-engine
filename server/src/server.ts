import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import redisClient from "./config/redis";

dotenv.config();

// Environment validation
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing in .env");
}

if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST is missing in .env");
}

if (!process.env.REDIS_PORT) {
  throw new Error("REDIS_PORT is missing in .env");
}

// Connect MongoDB
connectDB();

// Connect Redis
redisClient.connect()
  .then(() => console.log("Redis Connected"))
  .catch((err) => console.error("Redis Connection Failed:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});