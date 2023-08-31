import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dtos/auth.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/common/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { JWTpayload } from './types/JwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async SignUp(userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    const token = await this.createToken(user);
    return token;
  }

  private async createToken(user: User) {
    const jwtpayload: JWTpayload = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      phone: user.fullname,
      avatar: user.avatar,
      active: user.active,
      admin: user.admin,
    };

    const token = await this.jwtService.sign(jwtpayload, {
      secret: process.env.JWT_KEY,
      expiresIn: '7d',
    });
    return token;
  }
}
