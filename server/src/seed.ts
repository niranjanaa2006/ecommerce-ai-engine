import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Product from "./models/product";
import dotenv from "dotenv";

dotenv.config();

const categories = [
  "Mobiles",
  "Laptops",
  "Electronics",
  "Fashion",
  "Shoes",
  "Books",
  "Gaming",
  "Home Appliances"
];

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "HP",
  "Nike",
  "Adidas",
  "Puma"
];
const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected for Seeding");

    // clear old products
    await Product.deleteMany();

    let products = [];

    for (let i = 0; i < 1000; i++) {
  products.push({
    name: faker.commerce.productName(),

    description: faker.commerce.productDescription(),

    price: Number(faker.commerce.price()),

    category:
      categories[Math.floor(Math.random() * categories.length)],

    brand:
      brands[Math.floor(Math.random() * brands.length)],

    stock: Math.floor(Math.random() * 50) + 1,

    image: faker.image.url(),

    rating: Math.floor(Math.random() * 5) + 1,

    isAvailable: Math.random() > 0.2
  });
}

    await Product.insertMany(products);

    console.log("1000 Products Seeded Successfully");

    process.exit();

  } catch (error) {
    console.log("Seeding Failed", error);
    process.exit(1);
  }
};

seedProducts();