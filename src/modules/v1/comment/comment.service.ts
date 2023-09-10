import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Comment } from 'src/common/interfaces/comment.interface';
import { createCommentDTO } from '../home/dtos/home.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: PaginateModel<Comment>,
  ) {}

  async comment(commentDTO: createCommentDTO) {
    const newComment = new this.commentModel({
      user: commentDTO.user,
      comment: commentDTO.comment,
      ...commentDTO,
    });

    await newComment.save();

    return {
      status: 'The comment has been created!',
    };
  }
}
