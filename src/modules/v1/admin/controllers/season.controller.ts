import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { SeasonService } from '../services/season.service';
import { EditSeasonDTO, createSeasonDTO } from '../dto/admin.dto';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from '../../auth/types/jwtpayload.type';

@Auth()
@Controller({
    path: "admin/seasons",
    version: '1'
})
export class SeasonController {

    constructor(private seasonService: SeasonService) { }
    @HttpCode(HttpStatus.OK)
    @Get()
    async Index(@Query() BasePaginateDTO: BasePaginateDTO, @User() user: JwtPayload) {

        return await this.seasonService.index(BasePaginateDTO, user);
    }
    @HttpCode(HttpStatus.CREATED)
    @Post('/create')
    async Store(@Body() seasonDTO: createSeasonDTO) {
        return await this.seasonService.store(seasonDTO);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/create')
    async Create(@User() user: JwtPayload) {
        return await this.seasonService.create(user);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':courseId')
    async deleteOne(@Param('courseId') courseId: string) {
        return await this.seasonService.Destroy(courseId);
    }


    @HttpCode(HttpStatus.OK)
    @Get('edit/:seasonId')
    async edit(@Param('seasonId') seasonId: string) {
        return await this.seasonService.getOneForEdit(seasonId);

    }
    @HttpCode(HttpStatus.OK)
    @Put('edit/:seasonId')
    async updateOne(@Param('seasonId') seasonId: string, @Body() seasonDTO: EditSeasonDTO) {
        return await this.seasonService.update(seasonId, seasonDTO);

    }
}
