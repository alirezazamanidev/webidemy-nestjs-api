import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../../ability/ability.factory';
import { CHECK_ABILITY, RequireRole } from '../../ability/ability.decorators';

import { ForbiddenError } from '@casl/ability';
import { User } from 'src/common/interfaces/user.interface';
import { Action } from 'src/common/enums/action.enum';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private ablilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<RequireRole>(
      CHECK_ABILITY,
      context.getHandler(),
    );
    const { user } = context.switchToHttp().getRequest();
    const ability = this.ablilityFactory.createForUser(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(role.action, role.subjects);

      return true;
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }
}
