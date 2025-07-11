import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'Tên nhà hàng', example: 'Nhà hàng Gà Nướng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Địa chỉ nhà hàng',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ', example: '0987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Ảnh đại diện nhà hàng',
  })
  @IsOptional()
  file?: any;

  @ApiPropertyOptional({
    description: 'URL ảnh đại diện nhà hàng',
    example: 'https://cdn.example.com/restaurant.jpg',
  })
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'public Id của Image',
    example: '123123123',
  })
  @IsOptional()
  @IsString()
  image_public_id?: string | undefined;

  @ApiPropertyOptional({ description: 'Giờ mở cửa (HH:mm)', example: '08:00' })
  @IsOptional()
  @IsString()
  open_time?: string;

  @ApiPropertyOptional({
    description: 'Giờ đóng cửa (HH:mm)',
    example: '22:00',
  })
  @IsOptional()
  @IsString()
  close_time?: string;
}
