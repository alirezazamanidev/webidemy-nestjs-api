import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/common/models/user.model';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
