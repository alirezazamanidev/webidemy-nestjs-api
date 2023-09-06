import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EpisodeService } from '../../episode/episode.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { UploadVideoFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentEpisode } from 'src/common/decorators/get-current-episode.decorator';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from '../dto/admin.dto';
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
  @Get('/create')
  async create() {
    return await this.episodeService.create();
  }
  @HttpCode(HttpStatus.OK)
  @Delete('/:episodeId')
  async DeleteOne(@Param('episodeId') episodeId: string) {
    return await this.episodeService.destroy(episodeId);
  }
  @HttpCode(HttpStatus.OK)
  @Get('edit/:episodeId')
  async GetOneEpisodeForEdit(@Param('episodeId') episodeId: string) {
    return await this.episodeService.getOneForEdit(episodeId);
  }
  @HttpCode(HttpStatus.OK)
  @UploadVideoFile('video')
  @Put('edit/:episodeId')
  async Update(
    @Body() episodeDTO: UpdateEpisodeDTO,
    @Param('episodeId') episodeId: string,
  ) {
    return await this.episodeService.update(episodeId, episodeDTO);
  }
}
