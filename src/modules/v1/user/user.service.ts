import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';
import { RegisterDTO } from '../auth/dtos/auth.dto';
import { Messages } from 'src/common/enums/message.enum';
import slugify from 'slugify';
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
}
