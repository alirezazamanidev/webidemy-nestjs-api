import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { EpisodeService } from '../../episode/episode.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { UploadVideoFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentEpisode } from 'src/common/decorators/get-current-episode.decorator';
import { CreateEpisodeDTO } from '../dto/admin.dto';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
@Auth()
@Controller({
  path: 'admin/episodes',
  version: '1',
})
export class EpisodeController {
  constructor(private episodeService: EpisodeService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.episodeService.ShowEpisodesInAdminPanel(BasePaginateDTO);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  @UploadVideoFile('video')
  async Store(@GetCurrentEpisode() episodeDTO: CreateEpisodeDTO) {
    return await this.episodeService.store(episodeDTO);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/create/getseason')
  async create() {
    return await this.episodeService.getSeasonForCreateEpisode();
  }
}
