import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export class CreateVoucherDto {
  @ApiProperty({ example: 'SUMMER2025', description: 'Mã giảm giá' })
  @IsString()
  code: string;

  @ApiProperty({
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
    description: 'Loại giảm giá (theo % hoặc cố định)',
  })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ApiProperty({ example: 10, description: 'Giá trị giảm giá' })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 100, description: 'Số lượt sử dụng tối đa' })
  @IsNumber()
  max_uses: number;

  @ApiPropertyOptional({
    example: '2025-07-01T00:00:00.000Z',
    description: 'Ngày bắt đầu hiệu lực',
  })
  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @ApiPropertyOptional({
    example: '2025-08-01T00:00:00.000Z',
    description: 'Ngày hết hạn',
  })
  @IsOptional()
  @IsDateString()
  valid_to?: string;

  @ApiProperty({ example: true, description: 'Trạng thái kích hoạt' })
  @IsBoolean()
  is_active: boolean;
}
