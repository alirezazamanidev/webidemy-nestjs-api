import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Blog } from 'src/common/interfaces/blog.interface';

@Injectable()
export class BlogService {

    constructor(@InjectModel('Blog') private BlogModel: PaginateModel<Blog>) { }


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
}
