import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);
categorySchema.plugin(mongoosePaginate);
categorySchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'categories',
});
export { categorySchema };
