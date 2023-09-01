import { Document, ObjectId } from 'mongoose';
import { User } from './user.interface';
export interface Course extends Document {
  id: ObjectId;
  teacher: User;
  title: string;
  slug: string;
  body: string;
  description: string;
  type: string;
  condition: string;
  photos: object;
  tags: string;
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
