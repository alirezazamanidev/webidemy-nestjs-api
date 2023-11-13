import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import * as bcrypt from 'bcrypt';
const Schema = mongoose.Schema;
export const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    active: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    email: { type: String },
    phone: { type: String, required: true },
    biography: { type: String, defualt: null },
    role: { type: String, default: 'user' },
    adminPassword: { type: String, default: undefined },
    avatar: { type: String, default: undefined },
    hashRt: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.plugin(mongoosePaginate);
userSchema.pre('save', function (next) {
  if (!this.adminPassword) return next();
  const salt = bcrypt.genSaltSync(15);
  const hash = bcrypt.hashSync(this.adminPassword, salt);
  this.adminPassword = hash;
  next();
});

userSchema.methods.compareAdminPassword = function (pass:string) {
  return bcrypt.compareSync(pass, this.adminPassword);
};
