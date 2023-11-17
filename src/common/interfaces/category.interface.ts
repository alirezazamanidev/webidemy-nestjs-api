import mongoose, { Document } from 'mongoose';

export class Category extends Document {
  id: mongoose.Types.ObjectId;

  title: string;
  courses: string;
  createdAt: string;
  updatedAt: string;
}
