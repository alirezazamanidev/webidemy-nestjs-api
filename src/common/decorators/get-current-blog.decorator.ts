import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentBlog = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    return { ...req.body, file: req.file, user: req.user };
  },
);
