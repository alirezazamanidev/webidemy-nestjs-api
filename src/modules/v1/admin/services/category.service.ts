import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Category } from 'src/common/interfaces/category.interface';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: PaginateModel<Category>,
  ) {}
  async index(BasePaginateDTO: BasePaginateDTO) {
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
}
