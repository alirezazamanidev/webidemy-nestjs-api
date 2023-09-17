import { Document } from 'mongoose';

export class Category extends Document {
  title: string;
  courses: string;
  createdAt: string;
  updatedAt: string;
}
