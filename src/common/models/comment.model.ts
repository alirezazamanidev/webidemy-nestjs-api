import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    approved: { type: Boolean, default: false },
    course: { type: Schema.Types.ObjectId, ref: 'Course', default: undefined },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', default: undefined },

    episode: {
      type: Schema.Types.ObjectId,
      ref: 'Episode',
      default: undefined,
    },

    comment: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);
commentSchema.plugin(mongoosePaginate);

commentSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
});
const commentbelong = (doc) => {
  if (doc.course) return 'Course';
  else if (doc.episode) return 'Episode';
};
commentSchema.virtual('belongTo', {
  ref: commentbelong,
  localField: (doc) => commentbelong(doc).toLowerCase(),
  foreignField: '_id',
  justOne: true,
});
export { commentSchema };
