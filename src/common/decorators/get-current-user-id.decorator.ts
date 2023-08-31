import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/types/jwtpayload.type';
export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as JwtPayload;
    return user.id;
  },
);
