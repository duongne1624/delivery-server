import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['user', 'admin', 'shipper'])
  role: 'user' | 'admin' | 'shipper';
}
