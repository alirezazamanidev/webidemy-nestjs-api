import mongoose, { Document } from 'mongoose';
import { User } from './user.interface';
import { Episode } from './episode.interface';
import { Course } from './course.intreface';

export interface Comment extends Document {
  id: mongoose.Types.ObjectId;
  
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
