import {
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ example: 10.762622, description: 'Vĩ độ (Latitude)' })
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @ApiProperty({ example: 106.660172, description: 'Kinh độ (Longitude)' })
  @IsNumber()
  @Type(() => Number)
  lng: number;
}

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Nhà hàng ABC', description: 'Tên nhà hàng' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Nhà hàng chuyên đồ ăn Việt Nam' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123 Đường Lê Lợi, Quận 1, TP.HCM' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: true, description: 'Nhà hàng có đang mở không?' })
  @IsBoolean()
  is_open: boolean;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  open_time?: string;

  @ApiPropertyOptional({ example: '22:00' })
  @IsOptional()
  @IsString()
  close_time?: string;

  @ApiPropertyOptional({ type: LocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
