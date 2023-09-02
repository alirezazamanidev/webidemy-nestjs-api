import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CourseService } from '../../course/course.service';

@Controller({
  path: 'courses',
  version: '1',
})
export class CourseController {
  constructor(private courseService: CourseService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async Index() {
    return {
      status: 'success',
      courses: await this.courseService.showNewCoursesInHomePage(),
    };
  }
  @HttpCode(HttpStatus.OK)
  @Get(':slug')
  async signleCourse(@Param('slug') slug: string) {
    return {
      status: 'success',
      course: await this.courseService.singleCourseBySlug(slug),
    };
  }

}
