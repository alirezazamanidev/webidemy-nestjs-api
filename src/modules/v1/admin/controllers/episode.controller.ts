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

import { Auth } from 'src/common/decorators/Auth.decorator';
import { UploadVideoFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentEpisode } from 'src/common/decorators/get-current-episode.decorator';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from '../dto/admin.dto';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { EpisodeService } from '../services/episode.service';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from '../../auth/types/jwtpayload.type';
@Auth()
@Controller({
  path: 'admin/episodes',
  version: '1',
})
export class EpisodeController {
  constructor(private episodeService: EpisodeService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async Index(@Query() BasePaginateDTO: BasePaginateDTO,@User() user:JwtPayload) {
    return await this.episodeService.index(BasePaginateDTO,user);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  @UploadVideoFile('video')
  async Store(@GetCurrentEpisode() episodeDTO: CreateEpisodeDTO) {
    return await this.episodeService.store(episodeDTO);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/create')
  async create(@User() user:JwtPayload) {
    return await this.episodeService.create(user);
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
