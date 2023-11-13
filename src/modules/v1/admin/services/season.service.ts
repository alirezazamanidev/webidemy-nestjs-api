import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { SeasonCourse } from 'src/common/interfaces/season.interface';
import { createSeasonDTO } from '../dto/admin.dto';
import { Messages } from 'src/common/enums/message.enum';
import { Course } from 'src/common/interfaces/course.intreface';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
import isMongoId from 'validator/lib/isMongoId';

@Injectable()
export class SeasonService {
    constructor(@InjectModel('Season') private seasonModel: PaginateModel<SeasonCourse>, @InjectModel('Course') private courseModel: Model<Course>) { }
    async index(BasePaginateDTO: BasePaginateDTO, user: JwtPayload) {
        const { page, item_count } = BasePaginateDTO;

        const sessons = await this.seasonModel.paginate(
            {

            },
            {
                page,
                limit: item_count,
                populate: [
                    {
                        path: 'episodes',
                        select: 'title',
                    },
                    'course',
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
    async create(user: JwtPayload) {
        return await this.courseModel.find({ teacher: user.id });
    }
    async store(seasonDTO: createSeasonDTO) {
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
        if (!isMongoId(seasonId))
          throw new BadRequestException('The seasonId is not  true');
        const season = await this.seasonModel
          .findById(seasonId)
          .populate(['episodes']);
        if (!season) throw new BadRequestException(Messages.SEASON_NOT_EXIST);
    
        // delete video episodes
        // season.episodes.forEach((episode) => {
        //   fs.unlinkSync(`./public${episode?.videoUrl}`);
        // });
        // season.episodes.forEach((episode) => episode.deleteOne());
    
        //delete seasson
        season.deleteOne();
        return {
          status: 'success',
        };
      }
}
