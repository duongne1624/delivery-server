// src/modules/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: ['user', 'admin', 'shipper'], default: 'user' })
  @IsOptional()
  @IsString()
  role?: 'user' | 'admin' | 'shipper';
}
