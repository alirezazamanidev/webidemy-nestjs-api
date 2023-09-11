import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseModule } from '../course/course.module';
import { SeasonController } from './controllers/season.controller';
import { SeasonModule } from '../season/season.module';
import { EpisodeController } from './controllers/episode.controller';
import { EpisodeModule } from '../episode/episode.module';
import { UserController } from './controllers/user.controller';
import { UserModule } from '../user/user.module';
import { CategoryController } from './controllers/category.controller';
import { CategoryModule } from '../category/category.module';
import { CommentController } from './controllers/comment.controller';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    CourseModule,
    SeasonModule,
    EpisodeModule,
    UserModule,
    CommentModule,
    CategoryModule,
  ],
  controllers: [
    CourseController,
    SeasonController,
    EpisodeController,
    UserController,
    CategoryController,
    CommentController,
  ],
})
export class AdminModule {}
