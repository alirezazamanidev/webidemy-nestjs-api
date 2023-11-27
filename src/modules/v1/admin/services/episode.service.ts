
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Episode } from 'src/common/interfaces/episode.interface';
import { sprintf } from 'sprintf';

import * as fs from 'fs';
import slugify from 'slugify';
import { SeasonCourse } from 'src/common/interfaces/season.interface';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Course } from 'src/common/interfaces/course.intreface';
import isMongoId from 'validator/lib/isMongoId';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from '../dto/admin.dto';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
@Injectable()
export class EpisodeService {
    constructor(
        @InjectModel('Episode') private episodeModel: PaginateModel<Episode>,
        @InjectModel('Season') private seasonModel: PaginateModel<SeasonCourse>,
        @InjectModel('Course') private courseModel: PaginateModel<Course>,
    ) { }

    async create(user: JwtPayload) {
        const seasons = await this.seasonModel.find({}).populate({
            path: 'course',
            select: ['title', 'teacher']
        });
        return seasons.map(season => {
            return season?.course.teacher.toString() === user.id && season;
        })
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

        await (
            await newEpisode.save()
        ).populate({
            path: 'season',
            populate: 'course',
        });

        await this.updateCourseTime(newEpisode.season.course.id);
        return newEpisode;
    }

    async index(BasePaginateDTO: BasePaginateDTO, user: JwtPayload) {
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
                            select: ['title', 'teacher']
                        },
                    },
                ],
            },
        );

        let episodeList = episodes.docs.filter(episode => {
            return episode.season.course.teacher.toString() === user.id && episode;
        })
        return {
            data: episodeList,
            limit: episodes.limit,
            page: episodes.page,
            pages: episodes.pages,
        };
    }

    async destroy(episodeId: string) {
        if (!isMongoId(episodeId))
            throw new BadRequestException('The EpisodeId is not true');
        const episode = await this.episodeModel
            .findById(episodeId)
            .populate({
                path: 'season',
                populate: 'course',
            })
            .exec();
        if (!episode) throw new NotFoundException('The Episode Not found');

        fs.unlinkSync(`./public/${episode.videoUrl}`);
        episode.deleteOne();
        await this.updateCourseTime(episode.season.course.id);

        return {
            status: 'success',
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

    private async updateCourseTime(courseId: string) {
        const course = await this.courseModel
            .findById(courseId)
            .populate([
                {
                    path: 'seasons',
                    populate: ['episodes'],
                },
            ])
            .exec();
        course.time = this.getTime(course.seasons);
        await course.save();
    }
    private getTime(seasons: SeasonCourse[]) {
        let second = 0;

        seasons.forEach((season) => {
            season.episodes.forEach((episode) => {
                const time = episode.time.split(':');
                if (time.length === 2) {
                    second += parseInt(time[0]) * 60;
                    second += parseInt(time[1]);
                } else if (time.length === 3) {
                    second += parseInt(time[0]) * 3600;
                    second += parseInt(time[1]) * 60;
                    second += parseInt(time[2]);
                }
            });
        });

        let minutes = Math.floor(second / 60);

        const hours = Math.floor(minutes / 60);

        minutes -= hours * 60;

        second = Math.floor(((second / 60) % 1) * 60);

        return sprintf('%02d:%02d:%02d', hours, minutes, second);
    }
    async getOneForEdit(episodeId: string) {
        if (!isMongoId(episodeId))
            throw new BadRequestException('the EpisodeId is not True');
        const episode = await this.episodeModel
            .findById(episodeId)
            .populate('season')
            .exec();
        if (!episode) throw new NotFoundException('the episode not founded');
        return {
            episode,
            status: 'success'
        };
    }
    async update(episodeId: string, episodeDTO: UpdateEpisodeDTO) {
        const { title, body, file, type, time, number, season } = episodeDTO;
        if (!isMongoId(episodeId))
            throw new BadRequestException('the EpisodeId is not True');
        const episode = await this.episodeModel
            .findById(episodeId)
            .populate({
                path: 'season',
                populate: 'course',
            })
            .exec();
        if (!episode) throw new NotFoundException('the episode not founded');

        const objectforUpdate = {};
        if (file) {
            fs.unlinkSync(`./public/${episode.videoUrl}`);
            objectforUpdate['videoUrl'] = this.getUrlVideo(file);
        } else {
            objectforUpdate['videoUrl'] = episode.videoUrl;
        }

        await episode.updateOne({
            $set: {
                season,
                title,
                slug: slugify(title),
                body,
                type,
                number: number,
                time: file ? this.ChangeformatTime(time) : episode.time,
                ...objectforUpdate,
            },
        });
        await this.updateCourseTime(episode.season.course.id);

        return {
            status: 'success',
        };
    }

}
