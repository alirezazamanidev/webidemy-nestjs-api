import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';
import { RegisterDTO } from '../auth/dtos/auth.dto';
import { Messages } from 'src/common/enums/message.enum';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import isMongoId from 'validator/lib/isMongoId';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: PaginateModel<User>) {}

  // admin route
  async ShowUsersInadminPanel(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const courses = await this.userModel.paginate(
      {},
      {
        page,
        limit: item_count,
      },
    );
    return {
      data: courses.docs,
      limit: courses.limit,
      page: courses.page,
      pages: courses.pages,
    };
  }

  async destroy(userId: string) {
    if (!isMongoId(userId))
      throw new BadRequestException('The user id is not true');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not found');
    if (user.avatar) {
      fs.unlinkSync(`./public/${user.avatar}`);
    }
    user.deleteOne();
    return {
      status: 'success',
    };
  }
  async toggleAdmin(userId: string) {
    if (!isMongoId(userId))
      throw new BadRequestException('The user id is not true');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not found');

    await user.updateOne({ $set: { admin: !user.admin } });

    return {
      status: 'success',
    };
  }

  // auth route

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
