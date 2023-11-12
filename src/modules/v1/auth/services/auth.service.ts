/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';

import { User } from 'src/common/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { Messages } from 'src/common/enums/message.enum';
import { JwtPayload } from '../types/jwtpayload.type';
import { Tokens } from '../types/Tokens.type';
import * as bcrypt from 'bcrypt';
import { ActiveCodeService } from './active-code.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private ActiveCodeService: ActiveCodeService,
  ) {}
  async SignUp(userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    if (user?.active)
      throw new BadRequestException(Messages.ALREADY_FOR_ACTIVE_USER);
    const activeCodeList = await this.ActiveCodeService.findActiveCodeForUser(user.id);
    if (activeCodeList.length !== 0) {
      throw new HttpException(Messages.NOT_EXPIRE_CODE, 203);
    }
    const newActiveCode =
      await this.ActiveCodeService.createActivarionCode(user);

    // Send Sms for phone user
    console.log({
      phone: newActiveCode.phone,
      code: newActiveCode.code,
    });

    return {
      message: Messages.SEND_SMS,
      status: 'success',
      data: {
        verifyPhoneToken: newActiveCode.id,
      },
    };
  }

  async SignIn(userDTO: LoginDTO) {
    const user = await this.userService.findOneByPhone(userDTO?.phone);
    if (!user) throw new BadRequestException(Messages.PHONE_NOT_EXIST);
    if (user?.active)
      throw new BadRequestException(Messages.ALREADY_FOR_ACTIVE_USER);
    const activeCodeList = await this.ActiveCodeService.findActiveCodeForUser(user.id);
    if (activeCodeList.length !== 0) {
      throw new HttpException(Messages.NOT_EXPIRE_CODE, 203);
    }
    const newActiveCode =
      await this.ActiveCodeService.createActivarionCode(user);

    // Send Sms for phone user
    console.log({
      phone: newActiveCode.phone,
      code: newActiveCode.code,
    });

    return {
      message: Messages.SEND_SMS,
      status: 'success',
      data: {
        verifyPhoneToken: newActiveCode.id,
      },
    };
  }

  async createTokens(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      fullname: user.fullname,
      avatar: user.avatar,
      biography: user.biography,
      username: user.username,
      phone: user.phone,
      email: user.email,
      active: user.active,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.sign(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '5d',
      }),
      this.jwtService.sign(
        { id: user.id },
        {
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
          expiresIn: '10d',
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async RefreshToken(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');
    const checkerRT = await bcrypt.compare(rt, user.hashRt);
    if (!checkerRT) throw new ForbiddenException('Access Denied');
    const tokens = await this.createTokens(user);
    await this.userService.updateHashRt(user.id, tokens.refresh_token);
    return tokens;
  }
  async signOut(userId: string) {
    const user = await this.userService.findById(userId);

    await user.updateOne({ $set: { hashRt: '', active: false } });

    return {
      status: 'success',
      message: 'the User Logouted!',
    };
  }
}
