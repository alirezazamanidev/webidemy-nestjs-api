import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseModule } from '../course/course.module';
import { SeasonController } from './controllers/season.controller';
import { SeasonModule } from '../season/season.module';
import { EpisodeController } from './controllers/episode.controller';
import { EpisodeModule } from '../episode/episode.module';
import { UserController } from './controllers/user.controller';
import { CategoryController } from './controllers/category.controller';
import { CategoryModule } from '../category/category.module';
import { CommentController } from './controllers/comment.controller';
import { CommentModule } from '../comment/comment.module';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/common/models/user.model';
import { AuthModule } from '../auth/auth.module';
import { AbilityModule } from '../ability/ability.module';
import { APP_GUARD } from '@nestjs/core';
import { AbilityGuard } from './guards/ability.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    CourseModule,
    SeasonModule,
    EpisodeModule,
    AbilityModule,
    AuthModule,
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
  providers: [UserService],
})
export class AdminModule {}
