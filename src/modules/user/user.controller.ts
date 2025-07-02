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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    if (dto.email) {
      const existing = await this.userService.findByEmail(dto.email);
      if (existing) throw new BadRequestException('Email already exists');
    }

    return this.userService.create(dto);
  }
}
