import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { removeVietnameseTones } from '@common/utils/normalize.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category', 'restaurant'] });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'restaurant'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.productRepo.update(id, dto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  async getTopSellingProducts(limit = 10) {
    const rawProducts = await this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.orderItems', 'oi')
      .innerJoin('oi.order', 'o')
      .where('o.status = :status', { status: 'completed' })
      .select('p.id', 'id')
      .addSelect('p.name', 'name')
      .addSelect('p.price', 'price')
      .addSelect('p.image', 'image')
      .addSelect('p.restaurant_id', 'restaurant_id')
      .addSelect('SUM(oi.quantity)', 'total_sold')
      .groupBy('p.id')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    return rawProducts.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      restaurant_id: item.restaurant_id,
      total_sold: Number(item.total_sold),
    }));
  }

  async normalizeExistingRestaurantNames(): Promise<void> {
    const all = await this.productRepo.find();
    for (const r of all) {
      r.name_normalized = removeVietnameseTones(r.name);
      await this.productRepo.save(r);
    }
  }
}
