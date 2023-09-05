import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { SeasonCourse } from 'src/common/interfaces/season.interface';
import { createSeasonDTO } from '../admin/dto/admin.dto';
import { Messages } from 'src/common/enums/message.enum';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import * as fs from 'fs';
@Injectable()
export class SeasonService {
  constructor(
    @InjectModel('Season') private seasonModel: PaginateModel<SeasonCourse>,
  ) {}
  // admin panel
  async ShowSeasonInadminpanel(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const sessons = await this.seasonModel.paginate(
      {},
      {
        page,
        limit: item_count,
        populate: [
          {
            path: 'course',
          },
        ],
      },
    );
    return {
      data: sessons.docs,
      limit: sessons.limit,
      page: sessons.page,
      pages: sessons.pages,
    };
  }
  async create(seasonDTO: createSeasonDTO) {
    const { title, course, number } = seasonDTO;

    const sesson = await this.seasonModel.findOne({ title }).populate('course');

    if (sesson && sesson.course.id === course)
      throw new BadRequestException(Messages.SEASON_HAS_ALREADY);
    const newSeason = new this.seasonModel({
      title,
      course,
      number,
    });

    try {
      await newSeason.save();
      return {
        status: 'success',
        message: 'The seasson has been created!',
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  async Destroy(seasonId: string) {
    const season = await this.seasonModel
      .findById(seasonId)
      .populate(['episodes']);
    if (!season) throw new BadRequestException(Messages.SEASON_NOT_EXIST);

    // delete video episodes
    season.episodes.forEach((episode) => {
      fs.unlinkSync(`./public${episode?.videoUrl}`);
    });
    season.episodes.forEach((episode) => episode.deleteOne());

    //delete seasson
    season.deleteOne();
    return {
      status: 'success',
    };
  }
}
