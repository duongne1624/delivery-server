import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';
import { OrderResponseDto, UserSummaryDto } from './dto/order-response.dto';

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

  async create(dto: CreateOrderDto, userId: string): Promise<OrderResponseDto> {
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

    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }

  async findAll(userId): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { customer: { id: userId } },
      relations: ['items', 'items.product', 'shipper', 'customer'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  async findAllOrder(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      relations: ['items', 'items.product', 'shipper', 'customer'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'shipper', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapOrderToDto(order);
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

  async assignShipper(
    orderId: string,
    shipperId: string
  ): Promise<OrderResponseDto> {
    const shipper = await this.userRepo.findOneBy({ id: shipperId });
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product'],
    });

    if (!shipper || !order) throw new NotFoundException();

    order.shipper = shipper;
    order.status = 'confirmed';
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }

  private mapUserToSummary(user: User): UserSummaryDto {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
  }

  private mapOrderToDto = (order: Order): OrderResponseDto => {
    return {
      id: order.id,
      total_price: Number(order.total_price),
      status: order.status,
      delivery_address: order.delivery_address,
      note: order.note,
      customer: this.mapUserToSummary(order.customer),
      shipper: order.shipper ? this.mapUserToSummary(order.shipper) : null,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image,
        },
      })),
    };
  };
}
