import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Episode } from 'src/common/interfaces/episode.interface';

@Injectable()
export class EpisodeService {

    constructor(@InjectModel('Episode') private episodeModel: PaginateModel<Episode>) { }


    async GetSingleEpisode(courseSlug: string, episodeNum: string) {
        let epinumber = parseInt(episodeNum, 10);

        if (isNaN(epinumber))
            throw new NotFoundException("The episode not founded!");


        const episodes = await this.episodeModel.find({ number: epinumber }).populate([{
            path: "season",
            populate: {
                path: "course",
                select: ['slug', 'teacher','title'],
                populate: {
                    path: 'teacher',
                    select: ['username', 'fullname', 'avatar']
                }
            }

        }]);

        let findEpisode = episodes.find(episode => episode.season.course.slug === courseSlug);
        if (!findEpisode) throw new NotFoundException('Episode not found!');
        
        return findEpisode;

    }
}
