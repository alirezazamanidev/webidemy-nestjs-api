import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { EpisodeService } from '../services/episode.service';

@Controller({
    path:'episodes',
    version:'1'
})
export class EpisodeController {

    constructor(private episodeService:EpisodeService){}


    @HttpCode(HttpStatus.OK)
    @Get('/:courseSlug/:episodeNum')
    async Single(@Param('courseSlug') courseSlug:string,@Param('episodeNum') episodeNum:string){
        return {
            status:'success',
            episode:await this.episodeService.GetSingleEpisode(courseSlug,episodeNum)
        }
    }
}
