import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Blog } from 'src/common/interfaces/blog.interface';

@Injectable()
export class BlogService {

    constructor(@InjectModel('Blog') private BlogModel: PaginateModel<Blog>) { }

    async index(BasePaginateDTO: BasePaginateDTO,userId:string) {
        const { page, item_count } = BasePaginateDTO
        const blogPaginate = await this.BlogModel.paginate({author:userId}, {
            page, limit: item_count, populate: {
                path: 'author',
                select: ['fullname']
            }
        })
        

        return {
            data:blogPaginate.docs,
            limit: blogPaginate.limit,
            page: blogPaginate.page,
            pages: blogPaginate.pages,
        }
    }
}
