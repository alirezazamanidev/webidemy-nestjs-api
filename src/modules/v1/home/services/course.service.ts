import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Course } from 'src/common/interfaces/course.intreface';

@Injectable()
export class CourseService {

    constructor(@InjectModel('Course') private courseModel: PaginateModel<Course>) { }

    async Index(): Promise<Course[]> {
        try {
            return await this.courseModel.find({ isPublished: true }).sort({ createdAt: -1 }).populate({
                path: 'teacher',
            }).limit(8);

        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }

    }
    async GetsingleCourseBySlug(courseSlug: string):Promise<Course> {

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
}
