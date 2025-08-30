import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddItemDto } from './dto/add-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartsController {
  constructor(private readonly service: CartsService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.service.getUserCart(req.user.userId);
  }

  @Post('add')
  addItem(@Req() req: any, @Body() dto: AddItemDto) {
    return this.service.addItem(req.user.userId, dto);
  }
}
