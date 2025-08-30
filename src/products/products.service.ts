import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterProductDto } from './dto/filter-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
    constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private categories: CategoriesService,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categories.findOne(dto.categoryId);
    const product = this.repo.create({ ...dto, category });
    return this.repo.save(product);
  }

  async findAll(filters: FilterProductDto) {
    const { page = 1, limit = 10, categoryId } = filters;
    const qb = this.repo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .skip((page - 1) * limit)
      .take(limit);

    if (categoryId) qb.where('category.id = :categoryId', { categoryId });

    const [items, total] = await qb.getManyAndCount();
    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
