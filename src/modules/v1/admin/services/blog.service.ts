import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Blog } from 'src/common/interfaces/blog.interface';

@Injectable()
export class BlogService {

    constructor(@InjectModel('Blog') private BlogModel:PaginateModel<Blog>){}
}
