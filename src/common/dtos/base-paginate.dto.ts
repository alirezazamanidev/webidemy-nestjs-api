import { IsNotEmpty } from 'class-validator';

export class BasePaginateDTO {
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  item_count: number;
}
