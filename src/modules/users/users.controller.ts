import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/constants/role.enum';
import { AuthRequest } from '@common/interfaces/auth-request.interface';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User data' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const user = req.user;
    if (user.role !== Role.Admin && user.userId !== id) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'Updated user data' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthRequest
  ) {
    const user = req.user;
    if (user.role !== Role.Admin && user.userId !== id) {
      throw new ForbiddenException('Bạn không có quyền cập nhật');
    }
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const user = req.user;
    if (user.role !== Role.Admin && user.userId !== id) {
      throw new ForbiddenException('Bạn không có quyền xóa');
    }
    return this.usersService.delete(id);
  }
}
