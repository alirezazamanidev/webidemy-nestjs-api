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
import { Course } from 'src/common/interfaces/course.intreface';
import { User } from 'src/common/interfaces/user.interface';

export type Subjects = InferSubjects<typeof Course | typeof User> | 'all';

//  type AppAbility = MongoAbility<[Action, Subjects]>;
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
      } else if (user.role === Role.MANEGER) {
        can(Action.Delete, Course);
        can(Action.Read, Course);
        cannot(Action.Create, Course);
      }
    }
    return build({ conditionsMatcher: lambdaMatcher });
  }
}
