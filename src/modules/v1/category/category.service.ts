import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Category } from 'src/common/interfaces/category.interface';
import { createCategoryDTO } from '../admin/dto/admin.dto';
import { Messages } from 'src/common/enums/message.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) {}

  async store(categoryDTO: createCategoryDTO) {
    const { title } = categoryDTO;
    const category = await this.categoryModel.findOne({ title });
    if (category) throw new BadRequestException(Messages.CATEGORY_HAS_EXIST);

    const newCategory = new this.categoryModel({
      title,
    });
    await newCategory.save();

    return {
      status: 'messages',
      message: 'the Category has been created!',
    };
  }
}
