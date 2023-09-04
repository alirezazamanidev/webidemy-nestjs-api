import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseModule } from '../course/course.module';
import { SeasonController } from './controllers/season.controller';
import { SeasonModule } from '../season/season.module';
import { EpisodeController } from './controllers/episode.controller';
import { EpisodeModule } from '../episode/episode.module';
@Module({
  imports: [CourseModule, SeasonModule, EpisodeModule],
  controllers: [CourseController, SeasonController, EpisodeController],
})
export class AdminModule {}
