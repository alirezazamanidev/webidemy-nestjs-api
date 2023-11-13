import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { SeasonCourse } from 'src/common/interfaces/season.interface';
import { EditSeasonDTO, createSeasonDTO } from '../admin/dto/admin.dto';
import { Messages } from 'src/common/enums/message.enum';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import * as fs from 'fs';
import { isMongoId } from 'class-validator';
import { Course } from 'src/common/interfaces/course.intreface';
@Injectable()
export class SeasonService {
  constructor(
    @InjectModel('Season') private seasonModel: PaginateModel<SeasonCourse>,
    @InjectModel('Course') private courseModel: PaginateModel<Course>,
  ) {}

  async getOneForEdit(seasonId:string) {
    if (!isMongoId(seasonId))
      throw new BadRequestException('The seasonId is not  true');
    const season = await this.seasonModel.findById(seasonId).populate({
      path: 'course',
      select: 'title',
    });
    if (!season) throw new NotFoundException('The Season not found');

    return season;
  }
  async Destroy(seasonId: string) {
    if (!isMongoId(seasonId))
      throw new BadRequestException('The seasonId is not  true');
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
  async update(seasonId: string, seasonDTO: EditSeasonDTO) {
    if (!isMongoId(seasonId))
      throw new BadRequestException('The season Id is not true!');

    const season = await this.seasonModel.findById(seasonId);
    if (!season) throw new NotFoundException('The season is not found');

    await season.updateOne({ $set: { ...seasonDTO } });

    return {
      status: 'success',
    };
  }
}
