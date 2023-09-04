import mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    active: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    email: { type: String },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    hashRt: { type: String, default: null },
  },
  { timestamps: true },
);
