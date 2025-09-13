import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddItemDto } from './dto/add-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('cart')
@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
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

  @Patch('item/:itemId')
  updateItem(@Req() req: any, @Param('itemId') itemId: string, @Body() dto: UpdateItemDto) {
    return this.service.updateItem(req.user.userId, itemId, dto.quantity);
  }

  @Delete('item/:itemId')
  removeItem(@Req() req: any, @Param('itemId') itemId: string) {
    return this.service.removeItem(req.user.userId, itemId);
  }
}
