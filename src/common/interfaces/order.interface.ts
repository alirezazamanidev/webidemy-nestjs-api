import { Document } from 'mongoose';
import { User } from './user.interface';
import { Course } from './course.intreface';

export interface Order extends Document {
  id: string;
  user: User;
  course: Course;
  createdAt: Date;
  updatedAt: Date;
}
