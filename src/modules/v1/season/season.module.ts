import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { seasonCourseSchema } from 'src/common/models/seasonCourse.model';
import { SeasonService } from './season.service';
import { courseSchema } from 'src/common/models/course.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Season', schema: seasonCourseSchema },
      { name: 'Course', schema: courseSchema },
    ]),
  ],
  providers: [SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
