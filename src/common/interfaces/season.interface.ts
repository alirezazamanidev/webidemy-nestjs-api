import { Document } from 'mongoose';
import { Course } from './course.intreface';
export interface SeasonCourse extends Document {
  id: string;
  course: Course;
  title: string;
  createdAt: Date;
  updateAt: Date;
}
