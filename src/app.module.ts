import { Module } from '@nestjs/common';
import { AuthModule } from './modules/v1/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoURL } from './config/database/mongoose.config';
import { UserModule } from './modules/v1/user/user.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(getMongoURL()), UserModule],
})
export class AppModule {}
