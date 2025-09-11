import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES') || '1d' },
      }),
    }),
  ],
  // providers: [AuthService, JwtStrategy],
  providers: [AuthService, JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard, // primero validamos token
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard, // luego los roles
    // },
  ],
  controllers: [AuthController],
})
export class AuthModule { }
