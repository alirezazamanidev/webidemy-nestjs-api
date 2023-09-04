import { Document } from 'mongoose';
import { Course } from './course.intreface';
import { Episode } from './episode.interface';
export interface SeasonCourse extends Document {
  id: string;
  course: Course;
  title: string;
  number: number;
  episodes: Episode[];
  createdAt: Date;
  updateAt: Date;
}
