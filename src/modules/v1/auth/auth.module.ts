import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ global: true })],
  controllers: [AuthController],

  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
