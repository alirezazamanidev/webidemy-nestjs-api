import { IsArray } from 'class-validator';

export class PaginationDataDTO<T> {
  @IsArray()
  readonly data: T[];
  readonly limit: number;
  readonly page: number;
  readonly pages: number;
}
