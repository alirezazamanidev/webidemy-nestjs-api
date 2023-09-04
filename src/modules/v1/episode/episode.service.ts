import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Episode } from 'src/common/interfaces/episode.interface';
import { CreateEpisodeDTO } from '../admin/dto/admin.dto';
import * as path from 'path';
import * as fs from 'fs';
import slugify from 'slugify';
import { SeasonCourse } from 'src/common/interfaces/season.interface';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
@Injectable()
export class EpisodeService {
  constructor(
    @InjectModel('Episode') private episodeModel: PaginateModel<Episode>,
    @InjectModel('Season') private seasonModel: PaginateModel<SeasonCourse>,
  ) {}

  async getSeasonForCreateEpisode() {
    return await this.seasonModel.find({}).populate('course');
  }

  async store(episodeDTO: CreateEpisodeDTO) {
    const { title, season, file, body, type, time, number } = episodeDTO;
    const episode = await this.episodeModel.findOne({ title });
    if (episode)
      throw new BadRequestException(
        'چنین جلسه ای با این عنوان قبلا در سایت ثبت شده است!',
      );

    const newEpisode = new this.episodeModel({
      season,
      title,
      slug: slugify(title, '-'),
      body,
      number,
      type,
      time: this.ChangeformatTime(time),
      videoUrl: this.getUrlVideo(file),
    });

    await newEpisode.save();

    // await this.updateCourseTime(course);
    return newEpisode;
  }

  async ShowEpisodesInAdminPanel(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const episodes = await this.episodeModel.paginate(
      {},
      {
        page,
        limit: item_count,
        populate: [
          {
            path: 'season',
            populate: {
              path: 'course',
            },
          },
        ],
      },
    );

    return {
      data: episodes.docs,
      limit: episodes.limit,
      page: episodes.page,
      pages: episodes.pages,
    };
  }
  private getUrlVideo(video: Express.Multer.File) {
    const pathVideo = `${video.destination}/${video.filename}`;

    return pathVideo.substring(8);
  }

  private ChangeformatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
