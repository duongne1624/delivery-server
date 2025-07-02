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

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly service: VoucherService) {}

  @Get()
  async getAll(): Promise<Voucher[]> {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() dto: CreateVoucherDto): Promise<Voucher> {
    const existing = await this.service.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException('Voucher code already exists');
    }
    return this.service.create(dto);
  }
}
