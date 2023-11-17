import mongoose, { Document, ObjectId } from 'mongoose';
import { Blog } from './blog.interface';

export class User extends Document {
  id: string;
  fullname: string;
  username?: string;
  phone: string;
  adminPassword?: string;
  active: boolean;
  isAdmin: boolean;
  avatar: string;
  savedBlogList:Blog[]
  checkBookmarkedBlog:(blogId:mongoose.Types.ObjectId)=>boolean
  role: string;
  biography: string;
  email: string;
  compareAdminPassword: (pass: string) => boolean;
  hashRt: string;
  createdAt: Date;
  updatedAt: Date;
}
