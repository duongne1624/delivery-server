import { Module } from '@nestjs/common';
import { ShipperController } from './shipper.controller';
import { ShipperService } from './shipper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@entities/order.entity';
import { User } from '@entities/user.entity';
import { UserAddress } from '@entities/user-address.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';
import { Payment } from '@entities/payment.entity';
import { OrdersModule } from '@modules/orders/orders.module';
import { UsersModule } from '@modules/users/users.module';
import { PaymentsModule } from '@modules/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      UserAddress,
      OrderItem,
      Product,
      Payment,
    ]),
    OrdersModule,
    UsersModule,
    PaymentsModule,
  ],
  controllers: [ShipperController],
  providers: [ShipperService],
})
export class ShipperModule {}
