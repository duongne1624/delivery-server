import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { AddonModule } from '../addon/addon.module';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    UserModule,
    ProductModule,
    AddonModule,
    RestaurantModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
