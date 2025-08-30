import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class CartsService {
    constructor(
    @InjectRepository(Cart) private cartsRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemsRepo: Repository<CartItem>,
    private users: UsersService,
    private products: ProductsService,
  ) {}

  async getUserCart(userId: string) {
    let cart = await this.cartsRepo.findOne({ where: { user: { id: userId } } });
    if (!cart) {
      const user = await this.users.findOne(userId);
      cart = this.cartsRepo.create({ user, items: [] });
      cart = await this.cartsRepo.save(cart);
    }
    return cart;
  }

  async addItem(userId: string, dto: AddItemDto) {
    const cart = await this.getUserCart(userId);
    const product = await this.products.findOne(dto.productId);

    let item = cart.items.find((i) => i.product.id === product.id);
    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = this.itemsRepo.create({ product, quantity: dto.quantity, cart });
      cart.items.push(item);
    }

    await this.cartsRepo.save(cart);
    return cart;
  }

  async clearCart(userId: string) {
    const cart = await this.getUserCart(userId);
    cart.items = [];
    return this.cartsRepo.save(cart);
  }
}
