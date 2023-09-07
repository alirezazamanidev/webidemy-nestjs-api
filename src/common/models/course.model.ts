import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const courseSchema = new Schema(
  {
    categories: [
      { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    ],
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
    gradientColorCard: {
      fromColor: { type: String, required: true },
      toColor: { type: String, required: true },
    },
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
export { courseSchema };
