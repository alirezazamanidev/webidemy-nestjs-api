import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { UserController } from './controllers/user.controller';
import { CommentController } from './controllers/comment.controller';
import { OrderController } from './controllers/order.controller';
import { OrderModule } from '../order/order.module';
import { CourseService } from './services/course.service';
import { MongooseModule } from '@nestjs/mongoose';
import { courseSchema } from 'src/common/models/course.model';
import { categorySchema } from 'src/common/models/category.model';
import { UserService } from './services/user.service';
import { userSchema } from 'src/common/models/user.model';
import { CommentService } from './services/comment.service';
import { commentSchema } from 'src/common/models/comment.model';
import { blogSchema } from 'src/common/models/blog.model';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: courseSchema }, { name: "Blog", schema: blogSchema }, { name: "User", schema: userSchema }, { name: 'Category', schema: categorySchema }, { name: 'Comment', schema: commentSchema }]),
    OrderModule,
  ],
  controllers: [
    CourseController,
    UserController,
    CommentController,
    OrderController,
    BlogController,
  ],
  providers: [CourseService, UserService, CommentService, BlogService],
})
export class HomeModule { }
