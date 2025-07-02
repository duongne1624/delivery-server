import { IsString, IsIn } from 'class-validator';

export class CreateReportDto {
  @IsIn(['order', 'restaurant', 'user'])
  target_type: 'order' | 'restaurant' | 'user';

  @IsString()
  target_id: string;

  @IsString()
  reason: string;
}
