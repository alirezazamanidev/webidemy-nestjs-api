import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Order } from 'src/common/interfaces/order.interface';
import { StoreOrder } from '../home/dtos/home.dto';
import isMongoId from 'validator/lib/isMongoId';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: PaginateModel<Order>) {}

  async findById(orderId: string) {
    if (!isMongoId(orderId))
      throw new BadRequestException('The order Id is not true!');
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('The order not found');
    return order;
  }
  async index(userId: string) {
    if (!isMongoId(userId))
      throw new BadRequestException('The user id not founded!');
    const orders = await this.orderModel.find({ user: userId }).populate([
      {
        path: 'course',
        populate: {
          path: 'teacher',
          select: ['fullname'],
        },
      },
    ]);

    return orders;
  }

  async store(orderDTO: StoreOrder) {
    const { user, course } = orderDTO;

    const order = await this.orderModel.findOne({ course });
    if (order)
      throw new BadRequestException('دوره مورد نظر در سبد خرید شما موجود است');

    const newOrder = new this.orderModel({
      user,
      course,
    });
    await newOrder.save();

    return {
      status: 'success',
      message: 'the order has been created!',
    };
  }

  async destroy(orderId: string) {
    const order = await this.findById(orderId);

    order.deleteOne();
    return {
      status: 'success',
    };
  }
}
