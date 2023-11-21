import mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
export const commentSchema = new Schema(
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

const commentBlong = (doc: any) => {
  
  if (doc.course){
    return 'Course';
  }
  else if (doc.episode){
  
    return 'Episode';
  }
  else if (doc.blog){

    return 'Blog'
  }
}
commentSchema.virtual('belongTo', {
  ref:(doc:any)=>commentBlong(doc),
  localField:(doc:any)=>commentBlong(doc).toLowerCase(),
  foreignField:'_id',
  justOne:true
})

