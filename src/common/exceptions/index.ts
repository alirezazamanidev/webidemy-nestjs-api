import { ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import ValidationFilter from './validation.filter';
import { HttpExceptionsFilter } from './http.exception';

export const getGlobalFilters = (
  httpAdapter: HttpAdapterHost,
): ExceptionFilter<any>[] => [
  new HttpExceptionsFilter(httpAdapter),
  new ValidationFilter(),
];
