import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';
import { LoginUserAdminDTO } from '../dto/admin.dto';
import { AuthService } from '../../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { BasePaginateDTO } from 'src/common/dtos/base-paginate.dto';
import isMongoId from 'validator/lib/isMongoId';
import * as fs from 'fs';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: PaginateModel<User>,
    private authService: AuthService,
  ) {}
  async findById(userId: string) {
    if (!isMongoId(userId))
      throw new BadRequestException('The user Id is not true');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not found!');
    return user;
  }

  async login(userDTO: LoginUserAdminDTO) {
    const { email, adminPassword } = userDTO;
    const user = await this.userModel.findOne({ email });
    // if (!user || !user.compareAdminPassword(adminPassword))
    //   throw new BadRequestException('کاربری با این مشخصات در سات موجود نیست');
    if (!user.isAdmin)
      throw new ForbiddenException('شما اجازه دسترسی به پنل ادمین را ندارید');
    const tokens = await this.authService.createTokens(user);
    await this.updateHashRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateHashRt(userId: string, rt: string) {
    const hashRt = await bcrypt.hash(rt, 10);
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not founded!');
    await user.updateOne({ $set: { hashRt: hashRt } });
  }
  async findAll(BasePaginateDTO: BasePaginateDTO) {
    const { page, item_count } = BasePaginateDTO;

    const users = await this.userModel.paginate(
      {},
      {
        page: page,
        limit: item_count,
        sort: { createdAt: -1 },
      },
    );

    return {
      data: users.docs,
      limit: users.limit,
      page: users.page,
      pages: users.pages,
    };
  }

  async updateAdmin(userId: string) {
    const user = await this.findById(userId);

    await user.updateOne({ $set: { isAdmin: !user.isAdmin } });

    return {
      status: 'success',
    };
  }

  async destroy(userId: string) {
    const user = await this.findById(userId);
    if (user.avatar) {
      fs.unlinkSync(`./public/${user?.avatar}`);
    }
    user.deleteOne();

    return {
      status: 'success',
    };
  }
}
