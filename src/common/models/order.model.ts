import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
  },
  { timestamps: true },
);
orderSchema.plugin(mongoosePaginate);

export { orderSchema };
