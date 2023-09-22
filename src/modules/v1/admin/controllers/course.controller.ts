import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UploadImageFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentCourse } from 'src/common/decorators/get-current-course.decorator';
import { CreateCourseDTO, UpdateCourseDTO } from '../dto/admin.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { CheckAbilities } from '../../ability/ability.decorators';
import { Action } from 'src/common/enums/action.enum';
import { Course } from 'src/common/interfaces/course.intreface';
import { AbilityGuard } from '../guards/ability.guard';
import { CourseService } from '../services/course.service';

@Auth()
@Controller({
  path: 'admin/courses',
  version: '1',
})
export class CourseController {
  constructor(private courseService: CourseService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @CheckAbilities({ action: Action.Read, subjects: Course })
  @UseGuards(AbilityGuard)
  async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.courseService.index(BasePaginateDTO);
  }
  // @HttpCode(HttpStatus.CREATED)
  // @Post('create')
  // @UploadImageFile('photo')
  // async createCourse(@GetCurrentCourse() courseDTO: CreateCourseDTO) {
  //   return await this.courseService.store(courseDTO);
  // }
  // @HttpCode(HttpStatus.OK)
  // @Get('/create')
  // async Create() {
  //   return await this.courseService.getCategorties();
  // }

  // @HttpCode(HttpStatus.OK)
  // @Get('edit/:courseId')
  // async GetOneCourseForEdit(@Param('courseId') courseId: string) {
  //   return {
  //     status: 'success',
  //     course: await this.courseService.EditOneCourse(courseId),
  //   };
  // }
  // @HttpCode(HttpStatus.OK)
  // @Put('/edit/:id')
  // @UploadImageFile('photo')
  // async Update(
  //   @Param('id') courseId: string,
  //   @GetCurrentCourse() courseDTO: UpdateCourseDTO,
  // ) {
  //   return await this.courseService.updateOneCourse(courseId, courseDTO);
  // }
  // @HttpCode(HttpStatus.OK)
  // @Delete(':courseId')
  // async deleteCourse(@Param('courseId') courseId: string) {
  //   return await this.courseService.destroy(courseId);
  // }
}
