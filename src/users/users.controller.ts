import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get(':id')
  // getOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  //   return this.usersService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.delete(id);
  // }
  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('No puedes ver a otros usuarios');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('No puedes editar a otros usuarios');
    }
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('No puedes borrar a otros usuarios');
    }
    return this.usersService.delete(id);
  }
}