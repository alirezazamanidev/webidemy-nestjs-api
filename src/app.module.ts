import { Module } from '@nestjs/common';
import { AuthModule } from './modules/v1/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoURL } from './config/database/mongoose.config';
import { AdminModule } from './modules/v1/admin/admin.module';
import { HomeModule } from './modules/v1/home/home.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(getMongoURL()),
    AdminModule,
    HomeModule,
  ],
})
export class AppModule {}
