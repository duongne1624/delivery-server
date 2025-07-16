import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '@entities/payment.entity';
import { Order } from '@entities/order.entity';
import { OrdersModule } from '@modules/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order]), OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
