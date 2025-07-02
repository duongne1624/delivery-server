import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddonDto {
  @ApiProperty({ example: 'Extra Cheese', description: 'Tên addon' })
  @IsString()
  name: string;

  @ApiProperty({ example: 5000, description: 'Giá addon (VND)' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '60f7a6f35b2c4b3d88a2c1de',
    description: 'ID của nhà hàng',
  })
  @IsString()
  restaurant_id: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của addon',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
