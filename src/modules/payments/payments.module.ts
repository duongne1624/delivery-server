import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '@entities/payment.entity';
import { Order } from '@entities/order.entity';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '@shared/redis/redis.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { OrdersService } from '@modules/orders/orders.service';
import { UsersModule } from '@modules/users/users.module';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';
import { UserAddressService } from '@modules/user-address/user-address.service';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
import { UserAddress } from '@entities/user-address.entity';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '@modules/notifications/notification.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, OrderItem, Product, UserAddress]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    RedisModule,
    forwardRef(() => OrdersModule),
    UsersModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    OrdersService,
    UserAddressService,
    NotificationsGateway,
    NotificationsService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
