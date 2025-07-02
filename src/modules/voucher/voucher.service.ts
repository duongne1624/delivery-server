import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from './voucher.interface';
import { Model } from 'mongoose';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel('Voucher') private readonly voucherModel: Model<Voucher>
  ) {}

  async findAll(): Promise<Voucher[]> {
    return this.voucherModel.find().exec();
  }

  async create(data: Partial<Voucher>): Promise<Voucher> {
    return this.voucherModel.create(data);
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return this.voucherModel.findOne({ code }).exec();
  }
}
