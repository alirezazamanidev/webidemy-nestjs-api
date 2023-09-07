import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { categorySchema } from 'src/common/models/category.model';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: categorySchema }]),
  ],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
