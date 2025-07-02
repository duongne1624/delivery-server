import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Số điện thoại đăng nhập',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email (nếu có)',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'secret123',
    description: 'Mật khẩu tối thiểu 6 ký tự',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    example: 'user',
    enum: ['user', 'admin', 'shipper'],
    description: 'Vai trò của tài khoản (mặc định là user)',
  })
  @IsOptional()
  @IsIn(['user', 'admin', 'shipper'])
  role?: 'user' | 'admin' | 'shipper';
}
