import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('local/signUp')
  async RegisterUser(
    @Body()
    userDTO: RegisterDTO,
  ) {
    const tokens = await this.authService.SignUp(userDTO);
    return tokens;
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/signIn')
  async LoginUser(@Body() userDTO: LoginDTO) {
    const tokens = await this.authService.SignIn(userDTO);
    return tokens;
  }
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Get('/profile')
  ProfileUser(@Request() req) {
    return req?.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  async RefreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refresh_token') refreshToken: string,
  ) {
    const tokens = await this.authService.RefreshToken(userId, refreshToken);
    return tokens;
  }
  @Auth()
  @HttpCode(HttpStatus.OK)
  @Get('local/signOut')
  async logout(@Req() req) {
    return await this.authService.signOut(req?.user?.id);
  }
}
