import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletTransactionSchema } from './wallet.schema';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WalletTransaction', schema: WalletTransactionSchema },
    ]),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [MongooseModule],
})
export class WalletModule {}
