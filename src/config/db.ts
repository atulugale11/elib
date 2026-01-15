import mongoose from "mongoose";
import { config } from "./config";
import { mongo } from "globals";
const connectDB = async () => {
   try {
      mongoose.connection.on("connected", () => {
         console.log("Mongoose connected to DB");
      });

      mongoose.connection.on("error", (err) => {
         console.error(`MongoDB connection error: ${err}`);
         process.exit(1);
      });

      await mongoose.connect(config.databaseURL as string);
   } catch (error) {
      console.error(`Error, failed to connect to MongoDB: ${error}`);
      process.exit(1);
   }
};

export default connectDB;
