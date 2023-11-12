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
import { ActivationCodeDTO, LoginDTO, RegisterDTO } from './dtos/auth.dto';
import { AuthService } from './services/auth.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { User } from 'src/common/decorators/User.decorator';
import { JwtPayload } from './types/jwtpayload.type';
import { ActiveCodeService } from './services/active-code.service';
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private activeCodeService: ActiveCodeService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('local/signUp')
  async RegisterUser(
    @Body()
    userDTO: RegisterDTO,
  ) {
    return await this.authService.SignUp(userDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/signIn')
  async LoginUser(@Body() userDTO: LoginDTO) {
    return await this.authService.SignIn(userDTO);
  }
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Get('/profile')
  ProfileUser(@User() user: JwtPayload) {
    return user;
  }
  @HttpCode(HttpStatus.OK)
  @Post('activationCode')
  async AncivationCodeUser(@Body() activeCodeDTO: ActivationCodeDTO) {
    return await this.activeCodeService.CheckActivcationCode(activeCodeDTO);
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh')
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
