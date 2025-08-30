import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
    ) { }

    async findByEmail(email: string) {
        return this.usersRepo.findOne({ where: { email } });
    }

    async findOne(id: string) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async create(dto: CreateUserDto) {
        const exists = await this.findByEmail(dto.email);
        if (exists) throw new ConflictException('Email already registered');

        const profile = this.profilesRepo.create({
            phone: dto.phone,
            address: dto.address,
            city: dto.city,
            country: dto.country,
        });

        const user = this.usersRepo.create({
            name: dto.name,
            email: dto.email,
            password: '', // se setea en AuthService (hash)
            profile,
        });

        return this.usersRepo.save(user);
    }
}
