import { Module } from '@nestjs/common';
import { CourseModule } from '../course/course.module';
import { CourseController } from './controllers/course.controller';

@Module({
  imports: [CourseModule],
  controllers: [CourseController],
})
export class HomeModule {}
