import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterProductDto } from './dto/filter-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private categories: CategoriesService,
  ) { }

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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(product, updateProductDto);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.repo.remove(product);
    return { message: `Product with ID ${id} has been deleted` };
  }

  async findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  //Manejo de imagenes
  async setImage(id: string, filename: string) {
    const product = await this.findOne(id);
    product.image = filename;
    return this.repo.save(product);
  }

  async replaceImage(id: string, filename: string) {
    const product = await this.findOne(id);

    // borrar la anterior si existe
    if (product.image) {
      await this.deleteFile(product.image);
    }

    product.image = filename;
    return this.repo.save(product);
  }

  async deleteImage(id: string) {
    const product = await this.findOne(id);

    if (product.image) {
      await this.deleteFile(product.image);
      product.image = "";
      return this.repo.save(product);
    }
    return { message: 'No image found for this product' };
  }

  private async deleteFile(filename: string) {
    try {
      await unlink(join(process.cwd(), 'uploads/products', filename));
    } catch (e) {
      console.error('Error deleting file', e.message);
    }
  }
}
