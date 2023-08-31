import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegisterDTO } from './dtos/auth.dto';
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
}
