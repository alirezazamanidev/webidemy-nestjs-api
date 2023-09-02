import mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const seasonCourseSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
  },
  { timestamps: true },
);
