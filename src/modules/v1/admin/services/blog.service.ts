import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Blog } from 'src/common/interfaces/blog.interface';
import { BlogDTO } from '../dto/admin.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import slugify from 'slugify';
import { Messages } from 'src/common/enums/message.enum';
import isMongoId from 'validator/lib/isMongoId';
@Injectable()
export class BlogService {

    constructor(@InjectModel('Blog') private BlogModel: PaginateModel<Blog>) { }

    private async findOneById(blogId: string): Promise<Blog> {
        if (!isMongoId(blogId)) throw new BadRequestException("The blog Id is not true");

        const blog = await this.BlogModel.findById(blogId);

        return blog;

    }
    async index(BasePaginateDTO: BasePaginateDTO, userId: string) {
        const { page, item_count } = BasePaginateDTO
        const blogPaginate = await this.BlogModel.paginate({ author: userId }, {
            page, limit: item_count, populate: [{
                path: 'author',
                select: ['fullname']
            }, {
                path: 'category',
                select: ['title']
            }]
        })


        return {
            data: blogPaginate.docs,
            limit: blogPaginate.limit,
            page: blogPaginate.page,
            pages: blogPaginate.pages,
        }
    }

    async store(blogDTO: BlogDTO) {
        const { title, description, category, file, studyTime, user, toColor, fromColor, tags } = blogDTO;

        const images = this.ResizeImage(file);
        const blog = await this.BlogModel.findOne({ title });
        if (blog) throw new BadRequestException(Messages.ALREDY_EXIST_BLOG);

        const newBlog = new this.BlogModel({
            author: user.id,
            title,
            category,
            slug: slugify(title, '-'),
            description,
            studyTime,
            photos: images,
            GradientCardBlog: {
                fromColor,
                toColor,
            }, tags

        });

        await newBlog.save();
        return {
            status: 'success',
            messages: "The blog has been created!"
        }
    }

    async destroy(blogId:string){
        const blog=await this.findOneById(blogId);
        if(!blog) throw new NotFoundException('The blog is not found!');

        // delete  blpg image
        Object.values(blog.photos).forEach(image=>{
            fs.unlinkSync(`./public${image}`);
        })

        // delete blog
        blog.deleteOne();

        return {
            status:'success',
            message:'The blog has been removed',

        }

    }

    
    private ResizeImage(image: Express.Multer.File) {

        const imageInfo = path.parse(image.path);
        const addressImages = {};

        addressImages['original'] = this.getUrlImage(
            `${image.destination}/${image.filename}`,
        );

        const resize = (size: number) => {
            const imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
            addressImages[size] = this.getUrlImage(
                `${image.destination}/${imageName}`,
            );

            sharp(image.path)
                .resize(size, null)
                .toFile(`${image.destination}/${imageName}`);
        };

        [360, 1080].map(resize);

        return addressImages;
    }
    private getUrlImage(dir: string) {
        return dir.substring(8);
    }
}
