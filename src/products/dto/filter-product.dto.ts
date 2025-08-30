import { IsOptional, IsPositive, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsPositive()
  limit?: number = 10;
}
