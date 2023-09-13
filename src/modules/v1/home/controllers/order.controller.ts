import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { OrderService } from '../../order/order.service';
import { Auth } from 'src/common/decorators/Auth.decorator';
import { GetCurrentOrder } from 'src/common/decorators/get-current-order.decorator';
import { StoreOrder } from '../dtos/home.dto';

@Auth()
@Controller({
  path: 'orders',
  version: '1',
})
export class OrderController {
  constructor(private orderService: OrderService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async Index(@Req() req) {
    return await this.orderService.index(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  async create(@GetCurrentOrder() orderDTO: StoreOrder) {
    return await this.orderService.store(orderDTO);
  }
  @HttpCode(HttpStatus.OK)
  @Delete(':orderId')
  async DeleteOne(@Param('orderId') orderId: string) {
    return await this.orderService.destroy(orderId);
  }
}
