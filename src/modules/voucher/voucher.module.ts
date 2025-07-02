import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherSchema } from './voucher.schema';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Voucher', schema: VoucherSchema }]),
  ],
  providers: [VoucherService],
  controllers: [VoucherController],
  exports: [MongooseModule],
})
export class VoucherModule {}
