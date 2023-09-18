import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';
import { RegisterDTO } from '../auth/dtos/auth.dto';
import { Messages } from 'src/common/enums/message.enum';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import isMongoId from 'validator/lib/isMongoId';
import { EditProfileUserDtO } from '../home/dtos/home.dto';
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
  async findById(userId: string) {
    if (!isMongoId(userId))
      throw new BadRequestException('The user Id is not true');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not found!');
    return user;
  }

  async destroy(userId: string) {
    const user = await this.findById(userId);
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

    await user.updateOne({ $set: { admin: !user.isAdmin } });

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
      username: `@${slugify(fullname, '-')}-${crypto.randomInt(1000, 9999)}`,
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

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.findById(userId);
    const avatarUrl = this.getUrlImage(`${file.destination}/${file.filename}`);

    if (user?.avatar) {
      fs.unlinkSync(`./public/${user?.avatar}`);
    }
    await user.updateOne({ $set: { avatar: avatarUrl } });
    return {
      status: 'success',
    };
  }
  private getUrlImage(dir: string) {
    return dir.substring(8);
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new NotFoundException('The user not found!');
    return user;
  }
  async editProfile(userDTO: EditProfileUserDtO, userId) {
    const user = await this.findById(userId);
    const { fullname, email, username, biography } = userDTO;
    const userName =
      user.username.substring(1) === username ? user.username : `@${username}`;
    await user.updateOne({
      $set: {
        fullname,
        email,
        biography: biography ? biography : user.biography,
        username: userName,
      },
    });

    return {
      status: 'success',
    };
  }
}
