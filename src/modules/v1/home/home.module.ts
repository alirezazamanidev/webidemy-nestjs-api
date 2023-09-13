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

@Module({
  imports: [
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
})
export class HomeModule {}
