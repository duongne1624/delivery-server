import {
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @Type(() => Number)
  lat: number;

  @Type(() => Number)
  lng: number;
}

export class CreateRestaurantDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsString() address: string;
  @IsOptional() @IsString() phone?: string;
  @IsBoolean() is_open: boolean;
  @IsOptional() @IsString() open_time?: string;
  @IsOptional() @IsString() close_time?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
