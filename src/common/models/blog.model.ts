import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const blogSchema = new Schema(
  {

    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    slug: { type: String, required: true },
    description:{type:String,required:true},
    studyTime: { type: String, required: true },
    images: { type: Object, required: true },
    likeCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);
blogSchema.plugin(mongoosePaginate);

blogSchema.methods.inc = async function (filed: string, num: number = 1) {
  this[filed] += num;
};
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'course',
});
export { blogSchema };
