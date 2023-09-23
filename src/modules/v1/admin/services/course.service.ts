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
import * as fs from 'fs';
@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
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
  async destroy(courseId: string) {
    const course = await this.findById(courseId);
    course.populate([
      {
        path: 'seasons',
        populate: ['episodes'],
      },
    ]);
    if (!course) throw new NotFoundException('the id is not true!');

    // delete Images
    // Object.values(course.photos).forEach((image) =>
    //   fs.unlinkSync(`./public${image}`),
    // );

    //delete video episodes and episodes
    // course.seasons.forEach((season) => {
    //   season.episodes.forEach((episode) => {
    //     fs.unlinkSync(`./public/${episode.videoUrl}`);
    //     episode.deleteOne();
    //   });
    // });

    // // delete seasons
    // course.seasons.forEach((season) => season.deleteOne());
    course.deleteOne();
    return {
      status: 'sucess',
    };
  }
  async updatePublished(courseId: string) {
    const course = await this.findById(courseId);
    await course.updateOne({ $set: { isPublished: !course.isPublished } });
  }
}
