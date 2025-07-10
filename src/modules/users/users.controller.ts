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
  NotFoundException,
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
import { UpdateActiveDto } from './dto/update-active.dto';
import { SafeUser } from './interfaces/safe-user.interface';
import { MeResponseDto } from './dto/me-response.dto';

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
  async findAll(@Req() req: AuthRequest) {
    const user = req.user;
    if (user.role !== Role.Admin) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, type: MeResponseDto })
  async getCurrentUser(@Req() req: AuthRequest): Promise<SafeUser> {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      image: user.image,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
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

  @Patch('update-by-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Shipper)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate or deactivate shipper' })
  async updateByToken(@Body() dto: UpdateActiveDto, @Req() req: AuthRequest) {
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');

    if (user.role !== Role.Shipper)
      throw new ForbiddenException('Only shipper can be activated');

    if (req.user.userId !== user.userId)
      throw new ForbiddenException('Update not completed');

    return this.usersService.update(user.userId, dto);
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
