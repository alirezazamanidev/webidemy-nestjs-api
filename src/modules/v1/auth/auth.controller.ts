import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/local/signUp')
  async RegisterUser() {
    return await this.authService.SignUp();
  }
}
