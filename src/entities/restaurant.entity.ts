import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '@entities/product.entity';
import { User } from '@entities/user.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  name_normalized: string;

  @Column({ nullable: true })
  place_name: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  place_id: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  image_public_id: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'time', nullable: true })
  open_time: string;

  @Column({ type: 'time', nullable: true })
  close_time: string;

  @Column({ default: false })
  is_open_now: boolean;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column()
  created_by_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.restaurant, { eager: false })
  products: Product[];
}
