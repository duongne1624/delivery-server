import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddonDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  restaurant_id: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
