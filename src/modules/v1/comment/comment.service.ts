import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Comment } from 'src/common/interfaces/comment.interface';
import {
  AnswerCommentDTO,
  CommentDTO,
  createCommentDTO,
} from '../home/dtos/home.dto';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import isMongoId from 'validator/lib/isMongoId';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: PaginateModel<Comment>,
  ) {}
  async findById(commentId: string) {
    if (!isMongoId(commentId))
        throw new BadRequestException('The Comment Id Is not true!');

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('The comment not found');
    return comment;
}
 


  async approved(commentDTO: AnswerCommentDTO, userId: string) {
    const parentComment = await this.findById(commentDTO.parent);

    const newComment = new this.commentModel({
      user: userId,
      parent: parentComment.id,
      comment: commentDTO.comment,
      approved: true,
      ...commentDTO,
    });
    await newComment.save();
    await parentComment.updateOne({ $set: { approved: true } });

    return {
      status: 'success',
    };
  }

  // get comment for public route

  async getComments(commentDTO: CommentDTO) {
    const { subject, page, limit } = commentDTO;

    const comments = await this.commentModel.paginate(
      { ...subject, parent: null, approved: true },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'user',
            select: ['fullname', 'username', 'avatar'],
          },
          {
            path: 'comments',
            match: {
              approved: true,
            },
            populate: {
              path: 'user',
              select: ['fullname', 'username', 'avatar'],
            },
          },
        ],
      },
    );
    return {
      data: comments.docs,
      page: comments.page,
      pages: comments.pages,
      limit: comments.limit,
    };
  }
}
