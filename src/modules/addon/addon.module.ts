import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddonSchema } from './addon.schema';
import { AddonService } from './addon.service';
import { AddonController } from './addon.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Addon', schema: AddonSchema }]),
    RestaurantModule,
  ],
  controllers: [AddonController],
  providers: [AddonService],
  exports: [MongooseModule],
})
export class AddonModule {}
