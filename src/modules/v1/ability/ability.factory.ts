import {
  AbilityBuilder,
  InferSubjects,
  PureAbility,
  AbilityTuple,
  MatchConditions,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/common/enums/Role.enum';
import { Action } from 'src/common/enums/action.enum';
import { Category } from 'src/common/interfaces/category.interface';
import { Course } from 'src/common/interfaces/course.intreface';
import { User } from 'src/common/interfaces/user.interface';

export type Subjects =
  | InferSubjects<typeof Course | typeof User | typeof Category>
  | 'all';

export type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    if (user.isAdmin) {
      if (user.role === 'teach') {
        cannot(Action.Read, User).because('access denied!!');
        can(Action.Read, Course, ({ teacher }) => teacher === user.id);
        can(Action.Create, Course);
        cannot(Action.Manage, Category);
      } else if (user.role === Role.MANEGER) {
        can(Action.Manage, User);
        can(Action.Delete, Course);
        can(Action.Read, Course);
        can(Action.Manage, Category);
        cannot(Action.Create, Course);
      }
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
