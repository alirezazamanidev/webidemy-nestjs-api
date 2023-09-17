import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { LoginUserAdminDTO } from '../dto/admin.dto';
import { Action } from 'src/common/enums/action.enum';
import { User } from 'src/common/interfaces/user.interface';
import { CheckAbilities } from '../../ability/ability.decorators';
import { AbilityGuard } from '../guards/ability.guard';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { TransformInterceptor } from 'src/common/intercepter/transform.intecepter';
@Controller({
  path: '/admin/users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async SignIn(@Body() userDTO: LoginUserAdminDTO) {
    return this.userService.login(userDTO);
  }
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Read, subjects: User })
  @UseGuards(AbilityGuard)
  @Auth()
  @Get()
  async GetAllUser(@Query() BasePaginateDTO: BasePaginateDTO) {

    return await this.userService.findAll(BasePaginateDTO);
  }
  // @HttpCode(HttpStatus.OK)
  // @Get()
  // async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
  //   return await this.userService.ShowUsersInadminPanel(BasePaginateDTO);
  // }
  // @Auth()
  // @HttpCode(HttpStatus.OK)
  // @Delete(':userId')
  // async deleteOne(@Param('userId') userId: string) {
  //   return await this.userService.destroy(userId);
  // }
  // @Auth()
  // @HttpCode(HttpStatus.OK)
  // @Put(':userId')
  // async ToggleAdmin(@Param('userId') userId: string) {
  //   return await this.userService.toggleAdmin(userId);
  // }
}
