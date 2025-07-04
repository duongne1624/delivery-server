import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  customer: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'delivering', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column()
  delivery_address: string;

  @Column({ nullable: true })
  note: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
