import {
  Body,
  Controller,

  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { createCategoryDTO } from '../dto/admin.dto';
import { CategoryService } from '../../category/category.service';
@Auth()
@Controller({
  path: '/admin/categories',
  version: '1',
})
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() categoryDTO: createCategoryDTO) {
    return await this.categoryService.store(categoryDTO);
  }
}
