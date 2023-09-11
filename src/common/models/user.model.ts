import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
export const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    active: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    email: { type: String },
    phone: { type: String, required: true },
    biography: { type: String, defualt: null },
    avatar: { type: String, default: undefined },
    hashRt: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.plugin(mongoosePaginate);
