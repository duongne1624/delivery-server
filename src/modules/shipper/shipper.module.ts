import { Module } from '@nestjs/common';
import { ShipperController } from './shipper.controller';
import { ShipperService } from './shipper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@entities/order.entity';
import { User } from '@entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User])],
  controllers: [ShipperController],
  providers: [ShipperService],
})
export class ShipperModule {}
