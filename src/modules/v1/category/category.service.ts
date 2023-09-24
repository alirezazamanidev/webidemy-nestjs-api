import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Category } from 'src/common/interfaces/category.interface';
import { createCategoryDTO } from '../admin/dto/admin.dto';
import isMongoId from 'validator/lib/isMongoId';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) {}

  async edit(cateId: string) {
    if (!isMongoId) throw new BadRequestException('the cate id is not true');
    const cate = await this.categoryModel.findById(cateId);
    if (!cate) throw new NotFoundException('the category is not found!');

    return cate;
  }

  async update(cateId: string, categoryDTO: createCategoryDTO) {
    if (!isMongoId) throw new BadRequestException('the cate id is not true');
    const cate = await this.categoryModel.findById(cateId);
    if (!cate) throw new NotFoundException('the category is not found!');

    await cate.updateOne({ $set: { ...categoryDTO } });
    return {
      status: 'success',
    };
  }
  
}
