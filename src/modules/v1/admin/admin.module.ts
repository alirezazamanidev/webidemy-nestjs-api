import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { EpisodeController } from './controllers/episode.controller';
import { UserController } from './controllers/user.controller';
import { CategoryController } from './controllers/category.controller';
import { CommentController } from './controllers/comment.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/common/models/user.model';
import { AuthModule } from '../auth/auth.module';
import { AbilityModule } from '../ability/ability.module';
import { CourseService } from './services/course.service';
import { courseSchema } from 'src/common/models/course.model';
import { categorySchema } from 'src/common/models/category.model';
import { CategoryService } from './services/category.service';
import { SeasonService } from './services/season.service';
import { seasonCourseSchema } from 'src/common/models/seasonCourse.model';
import { SeasonController } from './controllers/season.controller';
import { EpisodeService } from './services/episode.service';
import { episodeSchema } from 'src/common/models/episode.model';
import { CommentService } from './services/comment.service';
import { commentSchema } from 'src/common/models/comment.model';
import { blogSchema } from 'src/common/models/blog.model';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Course', schema: courseSchema },
      { name: 'Category', schema: categorySchema },
      { name: 'Season', schema: seasonCourseSchema },
      { name: 'Episode', schema: episodeSchema },
      { name: 'Comment', schema: commentSchema },
      { name: "Blog", schema: blogSchema }
    ]),

    AbilityModule,
    AuthModule,
  ],
  controllers: [
    CourseController,
    SeasonController,
    EpisodeController,
    UserController,
    CategoryController,
    CommentController,
    BlogController,
  ],
  providers: [UserService, CourseService, CategoryService, SeasonService, EpisodeService, CommentService, BlogService],
})
export class AdminModule { }
