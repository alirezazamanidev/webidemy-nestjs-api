import { Document } from 'mongoose';

export interface Category extends Document {
  title: string;
  courses: string;
  createdAt: string;
  updatedAt: string;
}
