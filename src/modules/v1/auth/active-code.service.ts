import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActiveCode } from 'src/common/interfaces/activeCode';
import { User } from 'src/common/interfaces/user.interface';
import { Tokens } from './types/Tokens.type';
import { JwtPayload } from './types/jwtpayload.type';
import { Messages } from 'src/common/enums/message.enum';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ActivationCodeDTO } from './dtos/auth.dto';

@Injectable()
export class ActiveCodeService {
  constructor(
    @InjectModel('ActiveCode') private activeCodeModel: Model<ActiveCode>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async createActivarionCode(user: User): Promise<ActiveCode> {
    const TREE_MINUTES = 3 * 60 * 1000; // milliseconds
    const expireDate = new Date(Date.now() + TREE_MINUTES); // add tree minutes to current
    try {
      const newActiveCode = new this.activeCodeModel({
        user: user.id,
        phone: user.phone,
        code: await this.getUniqueCode(),
        expire: expireDate,
      });
      return await newActiveCode.save();
    } catch (err) {
      throw err;
    }
  }

  async findActiveCodeForUser(): Promise<ActiveCode[]> {
    return await this.activeCodeModel
      .find({})
      .gt('expire', new Date())
      .sort({ createdAt: 1 })
      .limit(1)
      .exec();
  }
  async CheckActivcationCode(activeCodeDTO: ActivationCodeDTO) {
    const { code, token } = activeCodeDTO;
    const activationCode = await this.activeCodeModel.findById(token).populate({
      path: 'user',
    });
    if (!activationCode || activationCode.code !== code)
      throw new HttpException(Messages.NOT_FOUND_ACTIVITIONCODE, 404);

    if (activationCode.expire < new Date())
      throw new HttpException(
        Messages.EXPIRE_ACTIVECODE,
        HttpStatus.NOT_ACCEPTABLE,
      );
    if (activationCode.used) {
      throw new HttpException(
        Messages.ALREDY_USE_ACTIVECODE,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const user = activationCode.user;
    await user.updateOne({ active: true });
    await activationCode.updateOne({ used: true });

    const tokens = await this.createTokens(user);
    await this.userService.updateHashRt(user.id, tokens.refresh_token);

    return tokens;
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
        expiresIn: '5m',
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

  private async getUniqueCode() {
    let code;

    do {
      code = Math.floor(100000 + Math.random() * 900000);
    } while (!(await this.checkIsCodeUnique(code)));

    return code;
  }

  async checkIsCodeUnique(code: number) {
    const activeCode = await this.activeCodeModel.findOne({ code });
    if (!activeCode) return true;
    return false;
  }
}
