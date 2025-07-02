import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.interface';
import { User } from '../user/user.interface';
import { Product } from '../product/product.interface';
import { Addon } from '../addon/addon.interface';
import { Restaurant } from '../restaurant/restaurant.interface';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Addon') private readonly addonModel: Model<Addon>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>
  ) {}

  async create(data: Order): Promise<Order> {
    const order = new this.orderModel(data);
    return order.save();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .exec();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      user_id: userId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== 'pending') {
      throw new BadRequestException('Order cannot be cancelled');
    }

    order.status = 'cancelled';
    return order.save();
  }

  async getOrderWithDetails(id: string): Promise<OrderDetailResponseDto> {
    const order = (await this.orderModel
      .findById(id)
      .populate('user_id', 'name phone')
      .populate('shipper_id', 'name phone')
      .populate('restaurant_id', 'name address phone')
      .populate('products.product_id', 'name price')
      .populate('products.addons.addon_id', 'name price')
      .lean()) as any;

    if (!order) throw new NotFoundException('Order not found');

    const result: OrderDetailResponseDto = {
      _id: order._id.toString(),
      user: {
        _id: order.user_id._id.toString(),
        name: order.user_id.name,
        phone: order.user_id.phone,
      },
      shipper: order.shipper_id
        ? {
            _id: order.shipper_id._id.toString(),
            name: order.shipper_id.name,
            phone: order.shipper_id.phone,
          }
        : undefined,
      restaurant: {
        _id: order.restaurant_id._id.toString(),
        name: order.restaurant_id.name,
        address: order.restaurant_id.address,
        phone: order.restaurant_id.phone,
      },
      products: order.products.map((p: any) => ({
        product_id: p.product_id._id.toString(),
        name: p.product_id.name,
        quantity: p.quantity,
        price: p.product_id.price,
        addons: (p.addons || []).map((a: any) => ({
          addon_id: a.addon_id._id.toString(),
          name: a.addon_id.name,
          quantity: a.quantity,
          price: a.addon_id.price,
        })),
      })),
      total_price: order.total_price,
      status: order.status,
      created_at: order.created_at,
    };

    return result;
  }
}
