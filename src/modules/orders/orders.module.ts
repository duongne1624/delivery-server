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
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '@modules/notifications/notification.schema';

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
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UsersModule,
    PaymentsModule,
    UserAddressModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    UserAddressService,
    NotificationsGateway,
    NotificationsService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
