import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Comment } from 'src/common/interfaces/comment.interface';
import isMongoId from 'validator/lib/isMongoId';
import { JwtPayload } from '../../auth/types/jwtpayload.type';

@Injectable()
export class CommentService {

    constructor(@InjectModel('Comment') private commentModel: PaginateModel<Comment>) { }

    async findById(commentId: string) {
        if (!isMongoId(commentId))
            throw new BadRequestException('The Comment Id Is not true!');

        const comment = await this.commentModel.findById(commentId);
        if (!comment) throw new NotFoundException('The comment not found');
        return comment;
    }

    async index(BasePaginateDTO: BasePaginateDTO, user: JwtPayload) {
        const { page, item_count } = BasePaginateDTO;

        const comments = await this.commentModel.paginate(
            {},
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
                        select: ['title', 'slug', 'teacher']

                    },
                    {
                        path: 'episode',
                        select:['season'],
                        populate: {
                            path: 'season',
                            select:['course'],
                            populate:{
                                path:'course',
                                select:'teacher'
                            }
                        }
                    }
                ],
            },
        );


        let CheckCommentType = (comment: Comment) => {
            if (comment?.course) {


                return comment;
            }
            else if (comment?.episode) {



                return comment.episode.season;
            }

        }


        let commentList = comments.docs.map(comment => {


            return CheckCommentType(comment).course.teacher.toString() === user.id && comment;
        })


        return {
            data: commentList,
            limit: comments.limit,
            page: comments.page,
            pages: comments.pages,
        };
    }

    // async paginateShowCommentsApproved(BasePaginateDTO: BasePaginateDTO,user:JwtPayload) {
    //     const { page, item_count } = BasePaginateDTO;

    //     const comments = await this.commentModel.paginate(
    //         { approved: true },
    //         {
    //             page,
    //             limit: item_count,
    //             sort: { createdAt: -1 },
    //             populate: [
    //                 {
    //                     path: 'user',
    //                     select: ['fullname', 'username', 'avatar'],
    //                 },
    //                 {
    //                     path: 'course',
    //                     select: ['title', 'slug','teacher'],
    //                 },
    //             ],
    //         },
    //     );

    //     let commentList = comments.docs.map(comment => {
    //         return comment.course.teacher.toString() === user.id && comment;
    //     })
    //     return {
    //         data: commentList,
    //         limit: comments.limit,
    //         page: comments.page,
    //         pages: comments.pages,
    //     };
    // }

    async destroy(commentId: string) {
        const comment = await this.findById(commentId);
        comment.deleteOne();
        return {
            status: 'success',
        };
    }

}
