import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/modules/v1/auth/types/jwtpayload.type';

export const GetCurrentComment = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req.user as JwtPayload;
    return { ...req.body, user: user.id };
  },
);
