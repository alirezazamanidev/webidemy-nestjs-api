import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
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
    @Request()
    @Body()
    userDTO: RegisterDTO,
    @Response() res,
  ) {
    const tokens = await this.authService.SignUp(userDTO);
    res
      .cookie('x-access-token', tokens.access_token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'lax',
        httpOnly: true,
      })
      .cookie('x-refresh-token', tokens.refresh_token, {
        expires: new Date(new Date().getTime() + 604800000),
        sameSite: 'lax',
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'success',
      });
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/signIn')
  async LoginUser(@Body() userDTO: LoginDTO, @Response() res) {
    const tokens = await this.authService.SignIn(userDTO);
    res
      .cookie('x-access-token', tokens.access_token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'lax',
        httpOnly: true,
      })
      .cookie('x-refresh-token', tokens.refresh_token, {
        expires: new Date(new Date().getTime() + 604800000),
        sameSite: 'lax',
        httpOnly: true,
      })
      .status(200)
      .json({
        status: 'success',
      });
  }
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Get('/profile')
  ProfileUser(@Request() req) {
    return req?.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh')
  async RefreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refresh_token') refreshToken: string,
    @Response() res,
  ) {
    
    const tokens = await this.authService.RefreshToken(userId, refreshToken);
    res
      .cookie('x-access-token', tokens.access_token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'lax',
        httpOnly: true,
      })
      .cookie('x-refresh-token', tokens.refresh_token, {
        expires: new Date(new Date().getTime() + 604800000),
        sameSite: 'lax',
        httpOnly: true,
      })
      .status(200)
      .json({
        status: 'success',
      });
  }
}
