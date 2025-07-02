import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
  async register(@Body() dto: RegisterDto): Promise<Partial<User>> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về token và thông tin người dùng',
  })
  async login(@Body() dto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Partial<User>;
  }> {
    return this.authService.login(dto);
  }
}
