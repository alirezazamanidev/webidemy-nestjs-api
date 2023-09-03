import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { seasonCourseSchema } from 'src/common/models/seasonCourse.model';
import { SeasonService } from './season.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Season', schema: seasonCourseSchema }]),
  ],
  providers: [SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
