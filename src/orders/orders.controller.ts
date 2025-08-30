import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post('checkout')
  checkout(@Req() req: any) {
    return this.service.checkout(req.user.userId);
  }

  @Get()
  myOrders(@Req() req: any) {
    return this.service.findUserOrders(req.user.userId);
  }
}
