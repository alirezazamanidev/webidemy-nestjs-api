import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Comment } from 'src/common/interfaces/comment.interface';
import { AnswerCommentDTO, createCommentDTO } from '../home/dtos/home.dto';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import isMongoId from 'validator/lib/isMongoId';

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
  async paginateShowCommentsNotApproved(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const comments = await this.commentModel.paginate(
      { approved: false },
      {
        page,
        limit: item_count,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'user',
            select: ['fullname', 'username', 'avatar'],
          },
          {
            path: 'course',
            select: ['title', 'slug'],
          },
        ],
      },
    );

    return {
      data: comments.docs,
      limit: comments.limit,
      page: comments.page,
      pages: comments.pages,
    };
  }

  async paginateShowCommentsApproved(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const comments = await this.commentModel.paginate(
      { approved: true },
      {
        page,
        limit: item_count,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'user',
            select: ['fullname', 'username', 'avatar'],
          },
          {
            path: 'course',
            select: ['title', 'slug'],
          },
        ],
      },
    );

    return {
      data: comments.docs,
      limit: comments.limit,
      page: comments.page,
      pages: comments.pages,
    };
  }
  async findById(commentId: string) {
    if (!isMongoId(commentId))
      throw new BadRequestException('The Comment Id Is not true!');

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('The comment not found');
    return comment;
  }

  async destroy(commentId: string) {
    const comment = await this.findById(commentId);
    comment.deleteOne();
    return {
      status: 'success',
    };
  }

  async approved(commentDTO: AnswerCommentDTO, userId: string) {
    const parentComment = await this.findById(commentDTO.parent);
    console.log(commentDTO.user);

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
}
