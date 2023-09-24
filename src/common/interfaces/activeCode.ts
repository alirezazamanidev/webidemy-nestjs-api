import { Document } from 'mongoose';
import { User } from './user.interface';

export class ActiveCode extends Document {
  id: string;
  user: User;
  phone: string;
  code: string;
  used: boolean;
  expire: Date;
  createdAt: Date;
}
