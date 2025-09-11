import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('orders')
@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Post('checkout')
  checkout(@Req() req: any) {
    return this.service.checkout(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Get()
  myOrders(@Req() req: any) {
    return this.service.findUserOrders(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Patch(':orderId/pay')
  payOrder(@Param('orderId') orderId: string, @Req() req: any) {
    return this.service.markAsPaid(orderId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':orderId/status')
  updateStatus(@Param('orderId') orderId: string, @Body() dto: UpdateOrderStatusDto) {
    return this.service.updateStatus(orderId, dto.status);
  }
}
