import { Document } from 'mongoose';
import { SeasonCourse } from './season.interface';
import { Category } from './category.interface';
import { Comment } from './comment.interface';
export class Course extends Document {
  category: Category;
  id: string;
  teacher: string;
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
  inc: (filed: string, num?: number) => void;
  commentCount: number;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}
