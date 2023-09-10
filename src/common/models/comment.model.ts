import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    approved: { type: Boolean, default: false },
    course: { type: Schema.Types.ObjectId, ref: 'Course', default: undefined },
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

export { commentSchema };
