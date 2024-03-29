import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, PaginateModel } from 'mongoose';
import { Blog } from 'src/common/interfaces/blog.interface';
import { Category } from 'src/common/interfaces/category.interface';
import { User } from 'src/common/interfaces/user.interface';
import { FilterQueryDTO } from '../dtos/home.dto';

@Injectable()
export class BlogService {

    constructor(@InjectModel('Blog') private BlogModel: PaginateModel<Blog>, @InjectModel('User') private userModel: Model<User>,@InjectModel('Category') private categoryModel:Model<Category>
    ){ }


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

    async singleBlog(blogSlug:string):Promise<Blog>{
        const blog=await this.BlogModel.findOne({slug:blogSlug})
        .populate([{
            path:'author',
            select:['fullname','avatar','biography'],

        },{
            path:'category',
            select:['title']
        }]).exec();

        return blog;
    }

    async savedBlog(userId: string, blogId: mongoose.Types.ObjectId) {
        const user = await this.userModel.findById(userId);
        const blog=await this.BlogModel.findById(blogId);
        if (user.checkBookmarkedBlog(blogId)) {

            await user.updateOne({ $pull: { savedBlogList: blogId } });
            await blog.updateOne({$inc:{bookMarkedCount:-1}});
        } else {
            await user.updateOne({ $push: { savedBlogList: blogId } });
            await blog.updateOne({$inc:{bookMarkedCount:1}});

        }

        return {
            status: 'success',
            message: "The blog has been bookmarked!"
        }
    }

    async updateLiked(userID: string, blogId: string) {
        const blog = await this.BlogModel.findById(blogId);

        if (blog.likedUserList.includes(userID)) {
            await blog.updateOne({ $pull: { likedUserList: userID },$inc:{likeCount:-1} })
        }
        else {
            await blog.updateOne({ $push: { likedUserList: userID },$inc:{likeCount:1} })

        }

        return {
            status: 'success'
        }

    }

    async FindByFilter(filterDTO:FilterQueryDTO){
    
        
        const query = {};
        const { limit, page, search, sort, category } = filterDTO;

        if (search) {
            query['title'] = new RegExp(search, 'gi');
        }


        const perPage = parseInt(limit) || 8;
        const currentPage = parseInt(page) || 1;
        const skip = (currentPage - 1) * perPage;
        if (category && category !== 'all') {
            const cate = await this.categoryModel.findOne({ title: category });
            if (cate) query['category'] = cate;
        }


        const blog = this.BlogModel.find({ ...query,isPublished:true });


        if (sort === 'newest') {
            blog.sort({ createdAt: -1 });
        }
        if(sort==='popular'){
            blog.sort({likeCount:-1});
        }

        const blogList = await blog
            .skip(skip)
            .limit(perPage)
            .populate([{
                path: 'author',
                select: ['fullname', 'avatar'],
            },{
                path:'category',
                select:['title']
            }])
            .exec();


        return {
            data: blogList,

            page: page,
            pages: skip,
        };
    }
}
