import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsString() category_id: string;
  @IsString() restaurant_id: string;
  @IsNumber() price: number;
  @IsBoolean() is_available: boolean;
}
