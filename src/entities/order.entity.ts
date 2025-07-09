import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  customer: User;

  @Column({ nullable: true })
  shipper_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  shipper: User;

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

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'update', 'remove'],
  })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
