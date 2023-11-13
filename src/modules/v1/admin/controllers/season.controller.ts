import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { SeasonService } from '../services/season.service';
import { createSeasonDTO } from '../dto/admin.dto';
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

        return await this.seasonService.index(BasePaginateDTO,user);
    }
    @HttpCode(HttpStatus.CREATED)
    @Post('/create')
    async Store(@Body() seasonDTO: createSeasonDTO) {
        return await this.seasonService.store(seasonDTO);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/create')
    async Create(@User() user:JwtPayload) {
        return await this.seasonService.create(user);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':courseId')
    async deleteOne(@Param('courseId') courseId:string){
        return await this.seasonService.Destroy(courseId);
    }
}
