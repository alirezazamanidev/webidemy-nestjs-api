import { Document } from 'mongoose';
import { User } from './user.interface';
import { SeasonCourse } from './season.interface';
import { Category } from './category.interface';
import { Comment } from './comment.interface';
export interface Course extends Document {
  category: Category;
  id: string;
  teacher: User;
  title: string;
  slug: string;
  body: string;
  description: string;
  type: string;
  condition: string;
  photos: object;
  tags: string;
  seasons: SeasonCourse[];
  price: string;
  gradientColorCard: {
    fromColor: string;
    toColor: string;
  };
  comments: Comment[];
  viewCount: number;
  commentCount: number;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}
