import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { commentSchema } from 'src/common/models/comment.model';
import { CommentService } from './comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: commentSchema }]),
  ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
