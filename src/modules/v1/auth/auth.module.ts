import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/At.strategy';
import { RefreshTokenStrategy } from './strategies/Rt.strategy';
@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ global: true })],
  controllers: [AuthController],

  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
