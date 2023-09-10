import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Course } from 'src/common/interfaces/course.intreface';
import { CreateCourseDTO, UpdateCourseDTO } from '../admin/dto/admin.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import slugify from 'slugify';
import isMongoId from 'validator/lib/isMongoId';
import { Messages } from 'src/common/enums/message.enum';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { SearchCourseQueryDTO } from '../home/dtos/home.dto';
import { Category } from 'src/common/interfaces/category.interface';
@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) {}

  // home panel route

  async filter(queryFilter: SearchCourseQueryDTO) {
    const query = {};

    const { limit, page, search, sort, category } = queryFilter;

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

    return await courses
      .skip(skip)
      .limit(perPage)
      .populate({
        path: 'teacher',
        select: ['fullname', 'avatar'],
      }).exec();
  }

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
  async store(courseDTO: CreateCourseDTO) {
    const {
      title,
      body,
      description,
      condition,
      file,
      fromColor,
      toColor,
      tags,
      category,
      user,
      type,
      price,
    } = courseDTO;

    const images = await this.ResizeImage(file);

    const course = await this.courseModel.findOne({ title });
    if (course) throw new BadRequestException(Messages);

    const newCourse = new this.courseModel({
      teacher: user.id,
      title,
      category,
      gradientColorCard: {
        fromColor,
        toColor,
      },
      slug: slugify(title, '-'),
      body,
      condition,
      price,
      type,
      description,
      photos: images,
      tags,
    });
    return await newCourse.save();
  }
  async EditOneCourse(courseID: string) {
    if (!isMongoId(courseID))
      throw new BadRequestException('the CourseId not true');

    const course = await this.courseModel
      .findById(courseID)
      .populate('category');

    if (!course) throw new NotFoundException('The course not founded');

    return course;
  }
  async updateOneCourse(courseId: string, courseDTO: UpdateCourseDTO) {
    const {
      user,
      title,
      category,
      body,
      description,
      fromColor,
      toColor,
      type,
      condition,
      price,
      file,
    } = courseDTO;
    if (!isMongoId(courseId))
      throw new BadRequestException('The course Id is Not True!');
    const course = await this.courseModel.findById(courseId);
    const objectforUpdate = {};
    if (file) {
      Object.values(course.photos).forEach((image) =>
        fs.unlinkSync(`./public${image}`),
      );
      objectforUpdate['photos'] = this.ResizeImage(file);
    } else {
      objectforUpdate['photos'] = course.photos;
    }
    await course.updateOne({
      $set: {
        teacher: user.id,
        title,
        slug: slugify(title, '-'),
        body,
        category,
        type,
        gradientColorCard: {
          toColor,
          fromColor,
        },
        description,
        condition,
        price,
        ...objectforUpdate,
      },
    });

    return {
      status: 'success',
    };
  }
  async destroy(courseId: string) {
    if (!isMongoId(courseId))
      throw new BadRequestException('The CourseId Is not true!');
    const course = await this.courseModel.findById(courseId).populate([
      {
        path: 'seasons',
        populate: ['episodes'],
      },
    ]);
    if (!course) throw new NotFoundException('the id is not true!');

    // delete Images
    Object.values(course.photos).forEach((image) =>
      fs.unlinkSync(`./public${image}`),
    );

    //delete video episodes and episodes
    course.seasons.forEach((season) => {
      season.episodes.forEach((episode) => {
        fs.unlinkSync(`./public/${episode.videoUrl}`);
        episode.deleteOne();
      });
    });

    // delete seasons
    course.seasons.forEach((season) => season.deleteOne());
    course.deleteOne();
    return {
      status: 'sucess',
    };
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

    [360, 480, 720, 1080].map(resize);

    return addressImages;
  }
  private getUrlImage(dir: string) {
    return dir.substring(8);
  }
}
