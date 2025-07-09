import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    return this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.orderItems', 'oi')
      .innerJoin('oi.order', 'o')
      .where('o.status = :status', { status: 'completed' })
      .select('p.id', 'id')
      .addSelect('p.name', 'name')
      .addSelect('p.price', 'price')
      .addSelect('p.image', 'image')
      .addSelect('SUM(oi.quantity)', 'total_sold')
      .groupBy('p.id')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
