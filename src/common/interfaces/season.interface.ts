import { Document } from 'mongoose';
import { Course } from './course.intreface';
export interface SeasonCourse extends Document {
  id: string;
  course: Course;
  title: string;
  number: number;
  createdAt: Date;
  updateAt: Date;
}
