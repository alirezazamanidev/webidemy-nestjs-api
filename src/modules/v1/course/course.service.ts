import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Course } from 'src/common/interfaces/course.intreface';
import { CreateCourseDTO, UpdateCourseDTO } from '../admin/dto/admin.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import slugify from 'slugify';
import { Messages } from 'src/common/enums/message.enum';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
  ) {}

  // home panel route
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
    const course = await this.courseModel.findOne({ slug });

    if (!course) throw new BadRequestException('the course not found!');
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
        populate: [
          {
            path: 'teacher',
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
  async findAll() {
    return await this.courseModel.find({});
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
  async EditOneCourse(courseID: string): Promise<Course> {
    const course = await this.courseModel.findById(courseID);

    if (!course) throw new BadRequestException('The course not founded');

    return course;
  }
  async updateOneCourse(courseId: string, courseDTO: UpdateCourseDTO) {
    const {
      user,
      title,
      body,
      description,
      fromColor,
      toColor,
      type,
      condition,
      price,
      file,
    } = courseDTO;
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
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new BadRequestException('the id is not true!');
    // delete Images
    Object.values(course.photos).forEach((image) =>
      fs.unlinkSync(`./public${image}`),
    );
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
