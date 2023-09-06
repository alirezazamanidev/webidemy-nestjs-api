import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import { Auth } from 'src/common/decorators/Auth.decorator';

@Auth()
@Controller({
  path: '/admin/users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async Index(@Query() BasePaginateDTO: BasePaginateDTO) {
    return await this.userService.ShowUsersInadminPanel(BasePaginateDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':userId')
  async deleteOne(@Param('userId') userId: string) {
    return await this.userService.destroy(userId);
  }
  @HttpCode(HttpStatus.OK)
  @Put(':userId')
  async ToggleAdmin(@Param('userId') userId: string) {
    return await this.userService.toggleAdmin(userId);
  }
}
