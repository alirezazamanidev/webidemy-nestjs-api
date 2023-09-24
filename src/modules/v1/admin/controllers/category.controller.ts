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
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { createCategoryDTO } from '../dto/admin.dto';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { CategoryService } from '../services/category.service';
import { CheckAbilities } from '../../ability/ability.decorators';
import { Action } from 'src/common/enums/action.enum';
import { Category } from 'src/common/interfaces/category.interface';
import { AbilityGuard } from '../guards/ability.guard';
@Auth()
@Controller({
  path: '/admin/categories',
  version: '1',
})
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @HttpCode(HttpStatus.CREATED)
  @CheckAbilities({ action: Action.Create, subjects: Category })
  @UseGuards(AbilityGuard)
  @Post('create')
  async create(@Body() categoryDTO: createCategoryDTO) {
    return await this.categoryService.store(categoryDTO);
  }
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Read, subjects: Category })
  @UseGuards(AbilityGuard)
  @Get()
  async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
    return this.categoryService.index(BasePaginateDTO);
  }

  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Delete, subjects: Category })
  @UseGuards(AbilityGuard)
  @Delete(':cateId')
  async Delete(@Param('cateId') cateId: string) {
    return await this.categoryService.destroy(cateId);
  }
  // @HttpCode(HttpStatus.OK)
  // @CheckAbilities({ action: Action.Update, subjects: Category })
  // @UseGuards(AbilityGuard)
  // @Get('edit/:cateId')
  // async Edit(@Param('cateId') cateId: string) {
  //   return await this.categoryService.edit(cateId);
  // }
  // @HttpCode(HttpStatus.OK)
  // @Put('edit/:cateId')
  // async Update(
  //   @Param('cateId') cateId: string,
  //   categoryDTO: createCategoryDTO,
  // ) {
  //   return await this.categoryService.update(cateId, categoryDTO);
  // }
}
