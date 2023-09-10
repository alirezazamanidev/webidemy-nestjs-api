import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  fullname: string;
  username?: string;
  phone: string;
  active: boolean;
  admin: boolean;
  avatar: string;
  biography: string;
  email: string;
  hashRt: string;
  createdAt: Date;
  updatedAt: Date;
}
