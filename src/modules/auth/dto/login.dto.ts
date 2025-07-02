import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Số điện thoại dùng để đăng nhập',
    example: '0987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Mật khẩu đăng nhập',
    example: 'mypassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
