import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng' })
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo thành công',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({ description: 'Email đã tồn tại' })
  async create(@Body() dto: CreateUserDto): Promise<User> {
    if (dto.email) {
      const existing = await this.userService.findByEmail(dto.email);
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
    }
    return this.userService.create(dto);
  }
}
