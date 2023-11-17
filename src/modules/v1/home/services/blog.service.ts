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
        const blog = await this.BlogModel.findById(blogId);
        if (!user) throw new NotFoundException("The user not founded");



        if (user.checkBookmarkedBlog(blog.id)) {

            let index = user.savedBlogList.indexOf(blog.id);
            if (index > -1) {
                user.savedBlogList.splice(index, 1);
            }
        } else {


            user.savedBlogList.push(blog.id);
        }
        
        
        await user.save();
        return {
            status: 'success',
            message: "The blog has been saved!"
        }
    }
}
