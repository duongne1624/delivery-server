import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeatureFlagDto {
  @ApiProperty({
    example: 'enable_new_checkout',
    description: 'Khóa định danh tính năng',
  })
  @IsString()
  key: string;

  @ApiPropertyOptional({
    example: 'Cho phép trải nghiệm giao diện thanh toán mới',
    description: 'Mô tả ngắn gọn về chức năng của flag',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái bật hoặc tắt của feature flag',
  })
  @IsBoolean()
  is_enabled: boolean;
}
