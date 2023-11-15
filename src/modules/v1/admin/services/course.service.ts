import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Course } from 'src/common/interfaces/course.intreface';
import isMongoId from 'validator/lib/isMongoId';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import slugify from 'slugify';
import { Messages } from 'src/common/enums/message.enum';
import { CourseDTO, UpdateCourseDTO } from '../dto/admin.dto';
import { Category } from 'src/common/interfaces/category.interface';
import { lookup } from 'dns';
@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) { }
  async findById(courseId: string) {
    if (!isMongoId(courseId))
      throw new BadRequestException('the CourseId not true');

    const course = await this.courseModel
      .findById(courseId)
      .populate([
        {
          path:'category'
        },
        {
          path:'seasons',
          populate:"episodes"
        }
      ]);
    if (!course) throw new NotFoundException('The course not founded');

    return course;
  }

  async index(BasePaginateDTO: BasePaginateDTO) {
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
  async indexMyCourse(BasePaginateDTO: BasePaginateDTO, userId: string) {
    const { page, item_count } = BasePaginateDTO;

    const courses = await this.courseModel.paginate(
      { teacher: userId },
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
  async store(courseDTO: CourseDTO) {
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
    if (course) throw new BadRequestException(Messages.ALREADY_EXIST_COURSE);

    const newCourse = new this.courseModel({
      teacher: user.id,
      title,
      category,
      GradientCardCourse: {
        fromColor,
        toColor
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
    const course = await this.findById(courseId);
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
    const course=await this.findById(courseId);
   if (!course) throw new NotFoundException('the id is not true!');
    
    Object.values(course.photos).forEach((image) =>{
      fs.unlinkSync(`./public${image}`);
     
    }
    );

    //delete video episodes and episodes
    course.seasons.forEach((season) => {
      season.episodes.forEach((episode) => {
        fs.unlinkSync(`./public/${episode.videoUrl}`);
        episode.deleteOne();
      });
    });

    // // delete seasons
    course.seasons.forEach((season) => season.deleteOne());
    course.deleteOne();
    return {
      status: 'sucess',
    };
  }
  async updatePublished(courseId: string) {
    const course = await this.findById(courseId);
    await course.updateOne({ $set: { isPublished: !course.isPublished } });
  }
  async EditOneCourse(courseID: string) {
    const course = await this.findById(courseID);
    return course;
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
