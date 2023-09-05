import { Document } from 'mongoose';
import { User } from './user.interface';
import { SeasonCourse } from './season.interface';
export interface Course extends Document {
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

  viewCount: number;
  commentCount: number;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}
