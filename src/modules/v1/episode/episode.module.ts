import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { episodeSchema } from 'src/common/models/episode.model';
import { EpisodeService } from './episode.service';
import { seasonCourseSchema } from 'src/common/models/seasonCourse.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Episode', schema: episodeSchema },
      { name: 'Season', schema: seasonCourseSchema },
    ]),
  ],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
