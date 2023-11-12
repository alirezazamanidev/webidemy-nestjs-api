import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  PaginateModel } from 'mongoose';
import { Comment } from 'src/common/interfaces/comment.interface';
import { CommentDTO, createCommentDTO } from '../dtos/home.dto';

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') private commentModel: PaginateModel<Comment>) { }

    async store(commentDTO: createCommentDTO) {
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
