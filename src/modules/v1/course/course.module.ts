import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { courseSchema } from 'src/common/models/course.model';
import { CourseService } from './course.service';
import { categorySchema } from 'src/common/models/category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: courseSchema },
      { name: 'Category', schema: categorySchema },
    ]),
  ],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
