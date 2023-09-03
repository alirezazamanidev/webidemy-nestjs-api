import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
// import * as bcrypt from 'bcrypt';
const episodeSchema = new Schema(
  {
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    videoUrl: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, required: true },
    time: { type: String, required: true },
    number: { type: Number, required: true },
    downloadCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
episodeSchema.plugin(mongoosePaginate);

// episodeSchema.methods.download = function (user: User) {
//   if (!user) return '#';
//   let status = false;
//   if (this.type === 'free') {
//     status = true;
//   } else if (this.type === 'vip') {
//     status = false;
//   } else if (this.type === 'free') {
//     status = true;
//   }

//   const timestamps = new Date().getTime() + 3600 * 1000 * 12;

//   const text = `aQTR@!#Fa#%!@%SDQGGASDF${this.id}${timestamps}`;

//   const salt = bcrypt.genSaltSync(15);
//   const hash = bcrypt.hashSync(text, salt);

//   return status ? `/download/${this.id}?mac=${hash}&t=${timestamps}` : '#';
// };

export { episodeSchema };
