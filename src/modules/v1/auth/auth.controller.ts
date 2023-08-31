import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {

    constructor(){}

    @HttpCode(HttpStatus.CREATED)
    @Post('/local/signUp')
    RegisterUser(@Body() )
}
