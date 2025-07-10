// src/modules/users/dto/update-user.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyen Van B' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'http://example.com/image.png' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'fdlgkdfj213' })
  @IsOptional()
  @IsString()
  image_public_id?: string;

  @ApiPropertyOptional({ enum: ['user', 'admin', 'shipper'], default: 'user' })
  @IsOptional()
  @IsString()
  role?: 'user' | 'admin' | 'shipper';
}
