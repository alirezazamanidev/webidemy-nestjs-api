import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Course } from 'src/common/interfaces/course.intreface';
import { CourseDTO, UpdateCourseDTO } from '../admin/dto/admin.dto';

import isMongoId from 'validator/lib/isMongoId';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Category } from 'src/common/interfaces/category.interface';
@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) {}

  async findById(courseId: string) {
    if (!isMongoId(courseId))
      throw new BadRequestException('the CourseId not true');

    const course = await this.courseModel
      .findById(courseId)
      .populate('category');

    if (!course) throw new NotFoundException('The course not founded');

    return course;
  }

  // home panel route

  // async filter(queryFilter: SearchCourseQueryDTO) {
  //   const query = {};

  //   const { limit, page, search, sort, category } = queryFilter;

  //   if (search) {
  //     query['title'] = new RegExp(search, 'gi');
  //   }

  //   const perPage = parseInt(limit) || 8;
  //   const currentPage = parseInt(page) || 1;
  //   const skip = (currentPage - 1) * perPage;

  //   if (category && category !== 'all') {
  //     const cate = await this.categoryModel.findOne({ title: category });
  //     if (cate) query['category'] = cate;
  //   }
  //   const courses = this.courseModel.find({ ...query });

  //   if (sort === 'newest') {
  //     courses.sort({ createdAt: -1 });
  //   }

  //   return await courses
  //     .skip(skip)
  //     .limit(perPage)
  //     .populate({
  //       path: 'teacher',
  //       select: ['fullname', 'avatar'],
  //     })
  //     .exec();
  // }

  async showNewCoursesInHomePage() {
    const courses = await this.courseModel
      .find()
      .populate({
        path: 'teacher',
      })
      .sort({ createdAt: -1 })
      .limit(8);

    return courses;
  }
  async singleCourseBySlug(slug: string) {
    const course = await this.courseModel.findOne({ slug }).populate([
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

  // admin panel route
  async showAdminPanelCourses(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const courses = await this.courseModel.paginate(
      {},
      {
        page,
        limit: item_count,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'teacher',
          },
          {
            path: 'category',
            select: 'title',
          },
          {
            path: 'seasons',
            select: 'title',
            populate: [
              {
                path: 'episodes',
                select: 'title',
              },
            ],
          },
        ],
      },
    );
    return {
      data: courses.docs,
      limit: courses.limit,
      page: courses.page,
      pages: courses.pages,
    };
  }
  async getCategorties() {
    return await this.categoryModel.find({});
  }


}
