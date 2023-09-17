import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/common/enums/action.enum';
import { Subjects } from './ability.factory';
export interface RequireRole {
  subjects: Subjects;
  action: Action;
}
export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (data: RequireRole) =>
  SetMetadata(CHECK_ABILITY, data);
