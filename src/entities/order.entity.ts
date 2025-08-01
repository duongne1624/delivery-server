import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Payment } from '@entities/payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  customer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ nullable: true })
  shipper_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'shipper_id' })
  shipper?: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'delivering', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';

  @Column({ type: 'timestamp', nullable: true })
  shipper_confirmed_at?: Date;

  @Column({ nullable: true })
  cancel_reason?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column()
  delivery_address: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  delivery_latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  delivery_longitude: number;

  @Column({ nullable: true })
  delivery_place_id?: string;

  @Column({ nullable: true })
  note?: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'update', 'remove'],
  })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  payment?: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
