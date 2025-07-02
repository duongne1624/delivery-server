import { IsBoolean } from 'class-validator';

export class UpdateFeatureFlagDto {
  @IsBoolean()
  is_enabled: boolean;
}
