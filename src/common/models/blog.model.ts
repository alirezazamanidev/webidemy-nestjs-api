import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const blogSchema = new Schema(
  {

    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },

    title: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    slug: { type: String, required: true },
    tags: { type: String, required: true },
    GradientCardBlog: {
      toColor: { type: String, required: true },
      fromColor: { type: String, required: true }
    },
    description: { type: String, required: true },
    studyTime: { type: String, required: true },
    photos: { type: Object, required: true },
    likedUserList:[{type:Schema.Types.ObjectId,ref:'User'}],
    bookMarkedCount:{type:Number,default:0},
    likeCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);
blogSchema.plugin(mongoosePaginate);

blogSchema.methods.inc = async function (filed: string, num: number = 1) {
  
  this[filed] += num;

  await this.save();
};
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'course',
});




export { blogSchema };
