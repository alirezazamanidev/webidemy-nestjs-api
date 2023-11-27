import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { SeasonCourse } from 'src/common/interfaces/season.interface';
import { EditSeasonDTO, createSeasonDTO } from '../dto/admin.dto';
import { Messages } from 'src/common/enums/message.enum';
import { Course } from 'src/common/interfaces/course.intreface';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
import isMongoId from 'validator/lib/isMongoId';
import * as fs from 'fs';
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
                    {
                        path:'course'
                    }
                ],
            },
        );

        
        
        let seasonList=sessons.docs.filter(season=>{
          
             
           return season.course.teacher.toString() ===user.id && season; 
        })

        
        
        return {
            data: seasonList,
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
