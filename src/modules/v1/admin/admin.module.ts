import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseModule } from '../course/course.module';
import { SeasonController } from './controllers/season.controller';
import { SeasonModule } from '../season/season.module';

@Module({
  imports: [CourseModule, SeasonModule],
  controllers: [CourseController, SeasonController],
})
export class AdminModule {}
