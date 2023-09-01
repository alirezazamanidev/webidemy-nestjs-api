import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CourseService } from '../../course/course.service';
import { UploadImageFile } from 'src/common/decorators/uploadFile.decorator';
import { GetCurrentCourse } from 'src/common/decorators/get-current-course.decorator';
import { CreateCourseDTO } from '../dto/admin.dto';

@Controller({
  path: 'admin/courses',
  version: '1',
})
export class CourseController {
  constructor(private courseService: CourseService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UploadImageFile('photo')
  async createCourse(@GetCurrentCourse() courseDTO: CreateCourseDTO) {
    return await this.courseService.store(courseDTO);
  }
}
