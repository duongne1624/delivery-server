import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '@entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { FileUploadService } from '@shared/file-upload/file-upload.service';
import { ProductsService } from '@modules/products/products.service';
import { Product } from '@entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [RestaurantsService, FileUploadService, ProductsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
