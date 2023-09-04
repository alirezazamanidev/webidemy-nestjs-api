import { Document } from 'mongoose';
import { SeasonCourse } from './season.interface';

export interface Episode extends Document {
  id: string;
  season: SeasonCourse;
  title: string;
  videoUrl: string;
  body: string;
  slug: string;
  type: string;
  time: string;
  number: number;
  downloadCount: number;
}
