import mongoose, { Document } from 'mongoose';
import { User } from './user.interface';
import { Episode } from './episode.interface';
import { Course } from './course.intreface';
import { Blog } from './blog.interface';
export interface Comment extends Document {
  id: mongoose.Types.ObjectId;
  
  user: User;
  parent: Comment;
  approved: boolean;
  episode?: Episode;
  course?: Course;
  blog?:Blog;
  belongTo: Course | Episode;
  comment: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
