import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Voucher } from './voucher.interface';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Vouchers')
@ApiBearerAuth() // nếu dùng JWT bảo vệ
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly service: VoucherService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách voucher' })
  @ApiResponse({ status: 200, description: 'Danh sách voucher' })
  async getAll(): Promise<Voucher[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo voucher mới' })
  @ApiResponse({ status: 201, description: 'Voucher đã được tạo' })
  @ApiResponse({ status: 400, description: 'Mã voucher đã tồn tại' })
  async create(@Body() dto: CreateVoucherDto): Promise<Voucher> {
    const existing = await this.service.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException('Voucher code already exists');
    }
    return this.service.create(dto);
  }
}
