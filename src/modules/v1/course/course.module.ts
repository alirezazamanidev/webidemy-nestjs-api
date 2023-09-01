import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { courseSchema } from 'src/common/models/course.model';
import { CourseService } from './course.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: courseSchema }]),
  ],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
