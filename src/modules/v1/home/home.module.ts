import { Module } from '@nestjs/common';
import { CourseModule } from '../course/course.module';
import { CourseController } from './controllers/course.controller';
import { EpisodeModule } from '../episode/episode.module';
import { UserController } from './controllers/user.controller';
import { UserModule } from '../user/user.module';
import { CommentController } from './controllers/comment.controller';
import { CommentModule } from '../comment/comment.module';
import { OrderController } from './controllers/order.controller';
import { OrderModule } from '../order/order.module';
import { CourseService } from './services/course.service';
import { MongooseModule } from '@nestjs/mongoose';
import { courseSchema } from 'src/common/models/course.model';
import { categorySchema } from 'src/common/models/category.model';
import { UserService } from './services/user.service';
import { userSchema } from 'src/common/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: courseSchema }, { name: "User", schema: userSchema }, { name: 'Category', schema: categorySchema }]),
    CourseModule,
    EpisodeModule,
    UserModule,
    CommentModule,
    OrderModule,
  ],
  controllers: [
    CourseController,
    UserController,
    CommentController,
    OrderController,
  ],
  providers: [CourseService, UserService],
})
export class HomeModule { }
