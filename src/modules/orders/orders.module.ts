import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '@entities/order.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';
import { User } from '@entities/user.entity';
import { Payment } from '@entities/payment.entity';
import { UsersModule } from '@modules/users/users.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { UserAddressService } from '@modules/user-address/user-address.service';
import { UserAddressModule } from '@modules/user-address/user-address.module';
import { UserAddress } from '@entities/user-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      User,
      UserAddress,
      Payment,
    ]),
    UsersModule,
    PaymentsModule,
    UserAddressModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UserAddressService],
  exports: [OrdersService],
})
export class OrdersModule {}
