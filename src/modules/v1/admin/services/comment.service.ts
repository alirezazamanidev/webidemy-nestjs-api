import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Comment } from 'src/common/interfaces/comment.interface';
import isMongoId from 'validator/lib/isMongoId';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
import { AnswerCommentDTO } from '../../home/dtos/home.dto';

@Injectable()
export class CommentService {

    constructor(@InjectModel('Comment') private commentModel: PaginateModel<Comment>, @InjectModel('Comment') private commentModelV2: Model<Comment>) { }

    async findById(commentId: string) {
        if (!isMongoId(commentId))
            throw new BadRequestException('The Comment Id Is not true!');

        const comment = await this.commentModelV2.findById(commentId).populate('comments').populate('belongTo').exec();

        if (!comment) throw new NotFoundException('The comment not found');
        return comment;
    }

    async index(BasePaginateDTO: BasePaginateDTO, user: JwtPayload) {
        const { page, item_count } = BasePaginateDTO;

        const comments = await this.commentModel.paginate(
            { parent: null },
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
                        path: 'comments',
                        populate: [{
                            path: 'user',
                            select: ['fullname', 'username', 'avatar']
                        }, {
                            path: 'blog',
                            select: ['title']
                        },
                        {
                            path: 'course',
                            select: ['title', 'slug']
                        }, {
                            path: 'episode',
                            select: ['title', 'slug']
                        }
                        ]
                    },
                    {
                        path: 'course',
                        select: ['title', 'slug', 'teacher']

                    },
                    {
                        path: 'episode',
                        select: ['season', 'title'],
                        populate: {
                            path: 'season',
                            select: ['course'],
                            populate: {
                                path: 'course',
                                select: 'teacher'
                            }
                        }
                    }, {
                        path: 'blog',
                        select: ['title', 'slug', 'author']
                    },
                ],
            },
        );




        let CheckCommentType = (comment: Comment) => {


            if (comment?.course) {

                return comment.course.teacher;
            }
            else if (comment?.episode) {

                return comment.episode.season.course.teacher;
            }
            else if (comment?.blog) {



                return comment.blog.author;
            }

        }




        let commentList = comments.docs.filter(comment => {
            return CheckCommentType(comment).toString() ===user.id && comment;
        })
    

        return {
            data: commentList,
            limit: comments.limit,
            page: comments.page,
            pages: comments.pages,
        };
    }
    async approved(commentDTO: AnswerCommentDTO, userId: string) {
        const parentComment = await this.findById(commentDTO.parent);
        const newComment = new this.commentModel({
            user: userId,
            parent: parentComment.id,
            comment: commentDTO.comment,
            approved: true,
            ...commentDTO.subject
        });

        await newComment.save();
        await parentComment.updateOne({ $set: { approved: true } });
        await parentComment.belongTo.inc('commentCount', 2);
        return {
            status: 'success',
        };
    }


    async destroy(commentId: string) {
        const comment = await this.findById(commentId);
        let removedCount = comment.comments.length;


        if (comment.comments.length > 0) {

            Object.values(comment.comments).forEach(async comment => {
                let subCmnt = await this.commentModelV2.findById(comment._id);
                if (comment) await subCmnt.deleteOne();
            });

        }

        //Decrease commentCount
        let totalRemoved = removedCount + 1
        await comment.belongTo.inc('commentCount', -2 * (totalRemoved));

        // Delete Comment
        await comment.deleteOne();
        return {
            status: 'success',
        };
    }

}
