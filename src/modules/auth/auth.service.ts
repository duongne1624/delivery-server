import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async register(dto: RegisterDto): Promise<Partial<User>> {
    const existing = await this.userModel.findOne({ phone: dto.phone });
    if (existing) throw new ConflictException('Phone already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      phone: dto.phone,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      created_at: new Date(),
    });

    return {
      _id: user._id,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Partial<User>;
  }> {
    const user = await this.userModel.findOne({ phone: dto.phone });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const payload = { user_id: user._id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    };
  }
}
