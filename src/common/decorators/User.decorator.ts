import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const Request = ctx.getRequest<Request>();
    return Request.user;
  },
);
