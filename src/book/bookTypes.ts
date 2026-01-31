import { User } from "../user/userTypes";

export interface Book {
   _id: string;
   title: string;
   author: string;
   genre: string;
   coverImageUrl: string;
   file: string;
   createdAt: Date;
   updatedAt: Date;
}
