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
import { Auth } from 'src/common/decorators/Auth.decorator';
import { UploadAvatarImageFile } from 'src/common/decorators/uploadFile.decorator';
import { EditProfileUserDtO } from '../dtos/home.dto';
import { UserService } from '../services/user.service';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from '../../auth/types/jwtpayload.type';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private userService:UserService ) {}

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

  @Auth()
  @HttpCode(HttpStatus.OK)
  @Get('/blogs/bookmarked')
  async GetBookMarkBlogs(@User() user:JwtPayload){
    return await this.userService.findAllBookMarkedBlogs(user.id)
  }
  
}
