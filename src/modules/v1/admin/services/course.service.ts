import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Course } from 'src/common/interfaces/course.intreface';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
  ) {}
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
}
