import { Document } from 'mongoose';

export class User extends Document {
  id: string;
  fullname: string;
  username?: string;
  phone: string;
  adminPassword?: string;
  active: boolean;
  isAdmin: boolean;
  avatar: string;
  savedBlogList:string[]
  role: string;
  biography: string;
  email: string;
  compareAdminPassword: (pass: string) => boolean;
  hashRt: string;
  createdAt: Date;
  updatedAt: Date;
}
