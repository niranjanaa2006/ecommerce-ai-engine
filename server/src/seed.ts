import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Product from "./models/product";
import dotenv from "dotenv";

dotenv.config();

const categories = [
  "Mobiles",
  "Electronics",
  "Fashion",
  "Shoes",
  "Books"
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected for Seeding");

    // clear old products
    await Product.deleteMany();

    let products = [];

    for (let i = 0; i < 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        category:
          categories[Math.floor(Math.random() * categories.length)],
        stock: Math.floor(Math.random() * 50) + 1,
        image: faker.image.url(),
      });
    }

    await Product.insertMany(products);

    console.log("100 Products Seeded Successfully");

    process.exit();

  } catch (error) {
    console.log("Seeding Failed", error);
    process.exit(1);
  }
};

seedProducts();