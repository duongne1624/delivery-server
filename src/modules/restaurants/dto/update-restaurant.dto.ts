import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của nhà hàng',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Trạng thái hiện tại',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_open_now?: boolean;
}
