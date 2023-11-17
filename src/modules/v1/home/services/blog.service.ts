import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, PaginateModel } from 'mongoose';
import { Blog } from 'src/common/interfaces/blog.interface';
import { User } from 'src/common/interfaces/user.interface';

@Injectable()
export class BlogService {

    constructor(@InjectModel('Blog') private BlogModel: PaginateModel<Blog>, @InjectModel('User') private userModel: Model<User>) { }


    async index(): Promise<Blog[]> {

        const blogs = await this.BlogModel.find({ isPublished: true }).limit(8).sort({ createdAt: -1 }).populate([{
            path: 'author',
            select: ['avatar', 'fullname']
        }, {
            path: 'category',
            select: ['title']
        }]).exec();

        return blogs;
    }

    async savedBlog(userId: string, blogId: mongoose.Types.ObjectId) {
        const user = await this.userModel.findById(userId);

        if (user.checkBookmarkedBlog(blogId)) {

            await user.updateOne({ $pull: { savedBlogList: blogId } });
        } else {
            await user.updateOne({ $push: { savedBlogList: blogId } });

        }

        return {
            status: 'success',
            message: "The blog has been bookmarked!"
        }
    }

    async updateLiked(userID: string, blogId: string) {
        const blog = await this.BlogModel.findById(blogId);

        if (blog.likedUserList.includes(userID)) {
            await blog.updateOne({ $pull: { likedUserList: userID } })
        }
        else {
            await blog.updateOne({ $push: { likedUserList: userID } })

        }

        return {
            status: 'success'
        }

    }
}
