import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Read, subjects: User })
  @UseGuards(AbilityGuard)
  @Auth()
  @Get('admin')
  async GetAdminUsers(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.userService.findAdminUser(BasePaginateDTO);
  }
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Update, subjects: User })
  @UseGuards(AbilityGuard)
  @Auth()
  @Put('role/:userId')
  async SetRole(@Param('userId') userId: string, @Body() role: any) {
    return await this.userService.setRole(userId, role);
  }
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Delete, subjects: User })
  @UseGuards(AbilityGuard)
  @Auth()
  @Delete(':userId')
  async deleteOne(@Param('userId') userId: string) {
    return await this.userService.destroy(userId);
  }
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ action: Action.Update, subjects: User })
  @UseGuards(AbilityGuard)
  @Auth()
  @Put(':userId')
  async ToggleAdmin(@Param('userId') userId: string) {
    return await this.userService.updateAdmin(userId);
  }
}
