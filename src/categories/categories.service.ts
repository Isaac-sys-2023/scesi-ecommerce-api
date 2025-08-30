import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private repo: Repository<Category>) { }

    async create(dto: CreateCategoryDto) {
        const exists = await this.repo.findOne({ where: { name: dto.name } });
        if (exists) throw new Error('Category already exists');
        const category = this.repo.create(dto);
        return this.repo.save(category);
    }

    async findAll() {
        return this.repo.find();
    }

    async findOne(id: string) {
        const cat = await this.repo.findOne({ where: { id } });
        if (!cat) throw new NotFoundException('Category not found');
        return cat;
    }
}
