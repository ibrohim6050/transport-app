import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orders.createOrder(req.user.userId, body);
  }

  @Get()
  list(@Req() req: any, @Query('status') status?: string, @Query('mine') mine?: string) {
    return this.orders.getOrders(req.user, status, mine);
  }

  @Get(':id')
  detail(@Req() req: any, @Param('id') id: string) {
    return this.orders.getOrderById(req.user, id);
  }

  @Post(':id/award')
  award(@Req() req: any, @Param('id') id: string, @Body('driverId') driverId: string) {
    return this.orders.awardOrder(req.user, id, driverId);
  }
}
