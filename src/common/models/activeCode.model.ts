import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const activeCodeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },
    code: { type: String, required: true },
    used: { type: Boolean, default: false },
    expire: { type: Date, required: true },
  },
  { timestamps: { createdAt: true } },
);

export { activeCodeSchema };
