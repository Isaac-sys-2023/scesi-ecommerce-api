import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private users: UsersService,
        private jwt: JwtService,
    ) { }

    async register(dto: CreateUserDto) {
        const user = await this.users.create(dto);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(dto.password, salt);
        await (await this.users['usersRepo']).save(user); // guardado final con hash
        return this.sign(user.id, user.email, user.role);
    }

    async login(email: string, password: string) {
        const user = await this.users.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        return this.sign(user.id, user.email, user.role);
    }

    private sign(sub: string, email: string, role: string) {
        const payload = { sub, email, role };
        // return { access_token: this.jwt.sign(payload) };
        return {
            access_token: this.jwt.sign(payload),
            user: { id: sub, email, role },
        };
    }
}
