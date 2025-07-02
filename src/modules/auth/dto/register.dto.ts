import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Số điện thoại của người dùng',
    example: '0987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    description: 'Email của người dùng (không bắt buộc)',
    example: 'example@email.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'mypassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: ['user', 'admin', 'shipper'],
    example: 'user',
  })
  @IsIn(['user', 'admin', 'shipper'])
  role: 'user' | 'admin' | 'shipper';
}
