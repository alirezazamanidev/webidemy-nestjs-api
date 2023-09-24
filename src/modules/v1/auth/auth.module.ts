import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/At.strategy';
import { RefreshTokenStrategy } from './strategies/Rt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { activeCodeSchema } from 'src/common/models/activeCode.model';
import { ActiveCodeService } from './active-code.service';
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([
      { name: 'ActiveCode', schema: activeCodeSchema },
    ]),
  ],
  controllers: [AuthController],

  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ActiveCodeService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
