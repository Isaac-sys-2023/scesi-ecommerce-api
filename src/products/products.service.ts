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
import { StorageService } from '../common/storage.service';
import { Express } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private categories: CategoriesService,
    private storage: StorageService,
  ) { }

  async create(dto: CreateProductDto) {
    const category = await this.categories.findOne(dto.categoryId);
    const product = this.repo.create({ ...dto, category });
    return this.repo.save(product);
  }

  private addImageUrl(product: any): any {
    if (!product.image) return product;

    if (product.image.startsWith('http')) {
      return { ...product, imageUrl: product.image };
    }

    return {
      ...product,
      imageUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/products/${product.image}`
    };
  }

  async findAll(filters: FilterProductDto) {
    const { page = 1, limit = 10, categoryId } = filters;
    const qb = this.repo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .skip((page - 1) * limit)
      .take(limit);

    if (categoryId) qb.where('category.id = :categoryId', { categoryId });

    const [items, total] = await qb.getManyAndCount();
    const parsedItems = items.map(i => this.addImageUrl(i));
    return {
      // data: items,
      data: parsedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    // return product;
    return this.addImageUrl(product);
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
  // async setImage(id: string, filename: string) {
  //   const product = await this.findOne(id);
  //   product.image = filename;
  //   return this.repo.save(product);
  // }
  async setImage(id: string, file: Express.Multer.File) {
    const product = await this.findOne(id);
    const urlOrPath = await this.storage.upload(file);
    product.image = urlOrPath;
    return this.repo.save(product);
  }

  // async replaceImage(id: string, filename: string) {
  //   const product = await this.findOne(id);

  //   // borrar la anterior si existe
  //   if (product.image) {
  //     await this.deleteFile(product.image);
  //   }

  //   product.image = filename;
  //   return this.repo.save(product);
  // }
  async replaceImage(id: string, file: Express.Multer.File) {
    const product = await this.findOne(id);

    if (product.image) {
      await this.storage.delete(product.image);
    }

    const urlOrPath = await this.storage.upload(file);
    product.image = urlOrPath;
    return this.repo.save(product);
  }

  // async deleteImage(id: string) {
  //   const product = await this.findOne(id);

  //   if (product.image) {
  //     await this.deleteFile(product.image);
  //     product.image = "";
  //     return this.repo.save(product);
  //   }
  //   return { message: 'No image found for this product' };
  // }
  async deleteImage(id: string) {
    const product = await this.findOne(id);

    if (product.image) {
      await this.storage.delete(product.image);
      product.image = null;
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
