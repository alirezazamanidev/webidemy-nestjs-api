import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { SeasonService } from '../../season/season.service';
import { createSeasonDTO } from '../dto/admin.dto';
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
    return this.seasonService.create(seasonDTO);
  }
}
