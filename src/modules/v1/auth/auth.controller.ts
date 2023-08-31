import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('local/signUp')
  async RegisterUser(@Body() userDTO: RegisterDTO) {
    const token = await this.authService.SignUp(userDTO);

    return {
      status: 'success',
      message: 'the user has been created!',
      webidemy_user_token: token,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('local/signIn')
  async LoginUser(@Body() userDTO: LoginDTO) {
    const token = await this.authService.SignIn(userDTO);

    return {
      status: 'success',
      message: 'the user successfully loggined!',
      webidemy_user_token: token,
    };
  }
}
