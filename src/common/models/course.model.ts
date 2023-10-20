import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const courseSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isPublished: { type: Boolean, default: false },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    body: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    condition: { type: String, required: true },
    photos: { type: Object, required: true },
    tags: { type: String, required: true },

    price: { type: String, required: true },

    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    time: { type: String, default: '00:00:00' },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);
courseSchema.plugin(mongoosePaginate);
courseSchema.virtual('seasons', {
  ref: 'Season',
  localField: '_id',
  foreignField: 'course',
});
courseSchema.methods.inc = async function (filed: string, num: number = 1) {
  this[filed] += num;
};
courseSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'course',
});
export { courseSchema };
