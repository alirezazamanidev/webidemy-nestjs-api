import mongoose, { ObjectId } from "mongoose";
import { Blog } from "src/common/interfaces/blog.interface";

export type JwtPayload = {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  biography: string;
  savedBlogList:Blog[];
  avatar?: string;
  role: string;
  active: boolean;
  isAdmin: boolean;
};
