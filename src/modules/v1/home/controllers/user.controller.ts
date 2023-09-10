import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { UploadAvatarImageFile } from 'src/common/decorators/uploadFile.decorator';
import { EditProfileUserDtO } from '../dtos/home.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Auth()
  @HttpCode(HttpStatus.OK)
  @UploadAvatarImageFile('avatar')
  @Post('uploadAvatar')
  async UploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return await this.userService.uploadAvatar(req.user?.id, file);
  }
  @HttpCode(HttpStatus.OK)
  @Get(':username')
  async GetUser(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    return {
      fullname: user.fullname,
      username: user.username,
    };
  }
  @Auth()
  @HttpCode(HttpStatus.OK)
  @Post('edit/profile')
  async EditProfile(@Req() req, @Body() userDTO: EditProfileUserDtO) {
    return await this.userService.editProfile(userDTO, req.user.id);
  }
}
