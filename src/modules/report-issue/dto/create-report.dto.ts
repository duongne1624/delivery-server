import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'Loại đối tượng bị báo cáo',
    enum: ['order', 'restaurant', 'user'],
    example: 'order',
  })
  @IsIn(['order', 'restaurant', 'user'])
  target_type: 'order' | 'restaurant' | 'user';

  @ApiProperty({
    description: 'ID của đối tượng bị báo cáo',
    example: '60f8c4622f8fb814c89d88aa',
  })
  @IsString()
  target_id: string;

  @ApiProperty({
    description: 'Lý do báo cáo',
    example: 'Hành vi gian lận hoặc không đúng quy định',
  })
  @IsString()
  reason: string;
}
