import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CourseService } from '../../course/course.service';
import { UploadImageFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentCourse } from 'src/common/decorators/get-current-course.decorator';
import { CreateCourseDTO } from '../dto/admin.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';

@Auth()
@Controller({
  path: 'admin/courses',
  version: '1',
})
export class CourseController {
  constructor(private courseService: CourseService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.courseService.showAdminPanelCourses(BasePaginateDTO);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UploadImageFile('photo')
  async createCourse(@GetCurrentCourse() courseDTO: CreateCourseDTO) {
    return await this.courseService.store(courseDTO);
  }
}
