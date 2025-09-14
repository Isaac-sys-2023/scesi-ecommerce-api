import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilterProductDto } from './dto/filter-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, productImageStorage } from '../common/upload.config';


@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() filters: FilterProductDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.service.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }


  // Subir imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: productImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
  }))
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // return this.service.setImage(id, file.filename);
    return this.service.setImage(id, file);
  }

  // Reemplazar imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: productImageStorage,
    fileFilter: imageFileFilter,
  }))
  async replaceImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // return this.service.replaceImage(id, file.filename);
    return this.service.replaceImage(id, file);
  }

  // Eliminar imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/image')
  async deleteImage(@Param('id') id: string) {
    return this.service.deleteImage(id);
  }
}
