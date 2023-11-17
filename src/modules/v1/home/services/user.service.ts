import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';
import isMongoId from 'validator/lib/isMongoId';
import * as fs from 'fs';
import { EditProfileUserDtO } from '../dtos/home.dto';
@Injectable()
export class UserService {

  constructor(@InjectModel('User') private userModel: Model<User>) { }
  async findById(userId: string) {
    if (!isMongoId(userId))
      throw new BadRequestException('The user Id is not true');
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('The user not found!');
    return user;
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

  async findAllBookMarkedBlogs(userId: string) {
    const user = (await this.findById(userId)).populate({
      path: 'savedBlogList',
      populate:[{
        path:"author",
        select:['fullname','avatar']
      },{
        path:'category',
        select:['title']
      }]
    });

    return (await user).savedBlogList
  }

}
