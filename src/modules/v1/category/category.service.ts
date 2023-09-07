import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Category } from 'src/common/interfaces/category.interface';
import { createCategoryDTO } from '../admin/dto/admin.dto';
import { Messages } from 'src/common/enums/message.enum';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import isMongoId from 'validator/lib/isMongoId';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) {}

  async showCategoriesInAdminPanel(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;
    const categories = await this.categoryModel.paginate(
      {},
      {
        page,
        limit: item_count,
        sort: { createdAt: -1 },
      },
    );

    return {
      data: categories.docs,
      limit: categories.limit,
      page: categories.page,
      pages: categories.pages,
    };
  }

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
  async destroy(cateId: string) {
    if (!isMongoId) throw new BadRequestException('the cate id is not true');
    const cate = await this.categoryModel.findById(cateId);
    if (!cate) throw new NotFoundException('the category is not found!');
    cate.deleteOne();
    return {
      status: 'success',
    };
  }
}
