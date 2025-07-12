import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '@entities/product.entity';
import { Restaurant } from '@entities/restaurant.entity';
import { Category } from '@entities/category.entity';
import { RestaurantsModule } from '@modules/restaurants/restaurants.module';
import { FileUploadService } from '@shared/file-upload/file-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Restaurant, Category]),
    RestaurantsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FileUploadService],
  exports: [ProductsService],
})
export class ProductsModule {}
