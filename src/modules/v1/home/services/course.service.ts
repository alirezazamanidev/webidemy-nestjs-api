import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FilterByInclude } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Course } from 'src/common/interfaces/course.intreface';
import { FilterQueryDTO } from '../dtos/home.dto';
import { Category } from 'src/common/interfaces/category.interface';

@Injectable()
export class CourseService {

    constructor(@InjectModel('Course') private courseModel: PaginateModel<Course>, @InjectModel('Category') private categoryModel: Model<Category>) { }

    async Index(): Promise<Course[]> {
        try {
            return await this.courseModel.find({ isPublished: true }).sort({ createdAt: -1 }).populate({
                path: 'teacher',
            }).limit(8);

        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }

    }
    async GetsingleCourseBySlug(courseSlug: string): Promise<Course> {

        const course = await this.courseModel.findOne({ slug: courseSlug }).populate([
            {
                path: 'category',
                select: 'title',
            },
            {
                path: 'teacher',
                select: ['fullname', 'avatar', 'biography'],
            },
            {
                path: 'seasons',
                populate: ['episodes'],
            },
        ]);

        if (!course) throw new NotFoundException('the course not found!');
        return course;
    }

    async findbyFilter(filterDTO: FilterQueryDTO) {
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


        const courses = this.courseModel.find({ ...query });


        if (sort === 'newest') {
            courses.sort({ createdAt: -1 });
        }

        const coursesList = await courses
            .skip(skip)
            .limit(perPage)
            .populate({
                path: 'teacher',
                select: ['fullname', 'avatar'],
            })
            .exec();

        return {
            data: coursesList,

            page: page,
            pages: skip,
        };
    }
    async getCategorties() {
        return await this.categoryModel.find({});
      }
    
}
