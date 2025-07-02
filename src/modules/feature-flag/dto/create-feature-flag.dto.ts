import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateFeatureFlagDto {
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  is_enabled: boolean;
}
