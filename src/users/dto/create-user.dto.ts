import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty() @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 }) @IsString() @MinLength(6)
  password: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  phone?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  address?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  city?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  country?: string;
}
