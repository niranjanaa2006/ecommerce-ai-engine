import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Failed");
    console.log(error);
  }
};

export default connectDB;