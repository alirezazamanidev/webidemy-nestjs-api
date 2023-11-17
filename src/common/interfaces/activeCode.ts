import mongoose, { Document } from 'mongoose';
import { User } from './user.interface';

export class ActiveCode extends Document {
  id: mongoose.Types.ObjectId;
  user: User;
  phone: string;
  code: string;
  used: boolean;
  expire: Date;
  createdAt: Date;
}
