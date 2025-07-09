import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from '@entities/restaurant.entity';
import { Category } from '@entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  is_available: boolean;

  @Column({ type: 'integer', default: 0 })
  discount_percent: number;

  @Column({ type: 'integer', default: 0 })
  sold_count: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  total_reviews: number;

  @Column()
  restaurant_id: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products, {
    eager: false,
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  category_id: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
