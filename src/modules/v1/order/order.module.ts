import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from 'src/common/models/order.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: orderSchema }]),
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
