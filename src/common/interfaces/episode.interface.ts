import { Document } from 'mongoose';
import { SeasonCourse } from './season.interface';

export class Episode extends Document {
  id: string;
  season: SeasonCourse;
  title: string;
  videoUrl: string;
  body: string;
  slug: string;
  type: string;
  time: string;
  inc: (filed: string, num?: number) => void;

  number: number;
  downloadCount: number;
}
