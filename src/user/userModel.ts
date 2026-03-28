import mongoose from "mongoose";
import { time } from "node:console";
import { User } from "./userTypes";

export const userSchema = new mongoose.Schema<User>(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

//users collection
export default mongoose.model<User>("User", userSchema);
