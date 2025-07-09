import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  async create(dto: CreateOrderDto, userId: string): Promise<Order> {
    const items: OrderItem[] = [];

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    let total = 0;
    for (const i of dto.items) {
      const product = await this.productRepo.findOneBy({ id: i.product_id });
      if (!product) throw new NotFoundException('Product not found');

      const price = Number(product.price) * i.quantity;
      total += price;

      const item = this.itemRepo.create({
        product,
        quantity: i.quantity,
        price: product.price,
      });

      items.push(item);
    }

    const order = this.orderRepo.create({
      customer: user,
      delivery_address: dto.delivery_address,
      note: dto.note,
      total_price: total,
      items,
    });

    return this.orderRepo.save(order);
  }

  async findAll(userId): Promise<Order[]> {
    return this.orderRepo.find({
      where: { customer: { id: userId } },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllOrder(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'shipper', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async delete(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    await this.itemRepo.remove(order.items);

    await this.orderRepo.remove(order);
  }

  async assignShipper(orderId: string, shipperId: string) {
    const shipper = await this.userRepo.findOneBy({ id: shipperId });
    const order = await this.orderRepo.findOneBy({ id: orderId });

    if (!shipper || !order) throw new NotFoundException();

    order.shipper = shipper;
    order.status = 'confirmed';
    return this.orderRepo.save(order);
  }
}
