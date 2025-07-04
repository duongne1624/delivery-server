// src/modules/auth/dto/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '0987654321',
    description: 'Phone number used for login',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'strongpassword123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
