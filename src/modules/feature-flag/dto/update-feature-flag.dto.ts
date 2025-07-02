import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureFlagDto {
  @ApiProperty({
    example: false,
    description: 'Trạng thái bật hoặc tắt của feature flag',
  })
  @IsBoolean()
  is_enabled: boolean;
}
