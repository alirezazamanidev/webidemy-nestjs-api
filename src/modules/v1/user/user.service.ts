import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';
import { RegisterDTO } from '../auth/dtos/auth.dto';
import { Messages } from 'src/common/enums/message.enum';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userDTO: RegisterDTO) {
    const { phone, fullname } = userDTO;
    const user = await this.userModel.findOne({ phone });
    if (user) throw new BadRequestException(Messages.PHONE_ALREADY_EXIST);
    const newUser = new this.userModel({
      phone,
      fullname,
      username: slugify(fullname, '-'),
    });
    try {
      const savedUser = await newUser.save();
      return savedUser;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  async findOneByPhone(phone: string) {
    return await this.userModel.findOne({ phone });
  }
  async updateHashRt(userId: string, rt: string) {
    const hashRt = await bcrypt.hash(rt, 10);
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not founded!');
    await user.updateOne({ $set: { hashRt: hashRt } });
  }
  async findById(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }
}
