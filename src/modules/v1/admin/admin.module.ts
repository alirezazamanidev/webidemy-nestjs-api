import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [CourseModule],
  controllers: [CourseController],
})
export class AdminModule {}
