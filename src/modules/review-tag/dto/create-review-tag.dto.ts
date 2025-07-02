import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateReviewTagDto {
  @IsString()
  tag: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
