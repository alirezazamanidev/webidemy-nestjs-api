import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
export const seasonCourseSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    number: { type: Number, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

seasonCourseSchema.virtual('episodes', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'season',
});

seasonCourseSchema.plugin(mongoosePaginate);
