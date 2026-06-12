import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";
console.log("REDIS_HOST =", process.env.REDIS_HOST);
console.log("REDIS_PORT =", process.env.REDIS_PORT);

const redisClient = createClient({
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redisClient;