import { Module } from '@nestjs/common';
import { CourseModule } from '../course/course.module';
import { CourseController } from './controllers/course.controller';
import { EpisodeModule } from '../episode/episode.module';

@Module({
  imports: [CourseModule, EpisodeModule],
  controllers: [CourseController],
})
export class HomeModule {}
