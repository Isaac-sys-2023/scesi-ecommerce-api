import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { CartsService } from 'src/carts/carts.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
    constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
    private carts: CartsService,
  ) {}

  async checkout(userId: string) {
    const cart = await this.carts.getUserCart(userId);
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const order = this.ordersRepo.create({
      user: cart.user,
      items: cart.items.map((ci) =>
        this.itemsRepo.create({
          product: ci.product,
          price: ci.product.price, // capturamos precio actual
          quantity: ci.quantity,
        }),
      ),
    });

    await this.ordersRepo.save(order);
    await this.carts.clearCart(userId);

    return order;
  }

  async findUserOrders(userId: string) {
    return this.ordersRepo.find({ where: { user: { id: userId } } });
  }
}
