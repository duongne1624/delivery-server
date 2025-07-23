import {
  IsString,
  IsNotEmpty,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'Short name for the address (e.g., Home, Office)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Full address details' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Latitude of the location', example: 10.762622 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: 106.660172,
  })
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({ description: 'Google Maps Place ID if available' })
  @IsOptional()
  @IsString()
  place_id?: string;

  @ApiPropertyOptional({ description: 'Additional note or instruction' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    description: 'Set this address as default',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
