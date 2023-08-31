import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtpayloadWithRt } from 'src/modules/auth/types/jwtPayloadWithRt.type';
export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtpayloadWithRt | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();

    if (!data) return req.user;
    return req.user[data];
  },
);
