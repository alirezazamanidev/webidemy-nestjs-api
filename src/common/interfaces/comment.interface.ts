import { Document } from 'mongoose';
import { User } from './user.interface';
import { Episode } from './episode.interface';
import { Course } from './course.intreface';

export interface Comment extends Document {
  id: string;
  user: User;
  parent: Comment;
  approved: boolean;
  episode?: Episode;
  course?: Course;
  belongTo: Course | Episode;
  comment: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
