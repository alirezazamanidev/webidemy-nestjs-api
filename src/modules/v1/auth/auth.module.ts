import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/At.strategy';
import { RefreshTokenStrategy } from './strategies/Rt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { activeCodeSchema } from 'src/common/models/activeCode.model';
import { ActiveCodeService } from './services/active-code.service';
import { UserService } from './services/user.service';
import { userSchema } from 'src/common/models/user.model';
@Module({
  imports: [
  
    PassportModule,
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([
      { name: 'ActiveCode', schema: activeCodeSchema },
      { name: "User", schema: userSchema }
    ]),
  ],
  controllers: [AuthController],

  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ActiveCodeService,
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule { }
