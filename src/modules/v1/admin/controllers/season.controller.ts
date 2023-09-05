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
import { SeasonService } from '../../season/season.service';
import { EditSeasonDTO, createSeasonDTO } from '../dto/admin.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';

@Auth()
@Controller({
  path: 'admin/seasons',
  version: '1',
})
export class SeasonController {
  constructor(private seasonService: SeasonService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.seasonService.ShowSeasonInadminpanel(BasePaginateDTO);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/create')
  Store(@Body() seasonDTO: createSeasonDTO) {
    return this.seasonService.store(seasonDTO);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/create')
  async create() {
    return await this.seasonService.create();
  }
  @HttpCode(HttpStatus.OK)
  @Delete(':seasonId')
  async DeleteOne(@Param('seasonId') seasonId: string) {
    return await this.seasonService.Destroy(seasonId);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/edit/:seasonId')
  async getOneSeasonForEdit(@Param('seasonId') seasonId: string) {
    return await this.seasonService.getOneForEdit(seasonId);
  }
  @HttpCode(HttpStatus.OK)
  @Put('/edit/:seasonId')
  async Update(
    @Body() seasonDTO: EditSeasonDTO,
    @Param('seasonId') seasonId: string,
  ) {
    return await this.seasonService.update(seasonId, seasonDTO);
  }
}
