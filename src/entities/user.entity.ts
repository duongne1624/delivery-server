import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAddress } from '@entities/user-address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  image_public_id?: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin' | 'shipper';

  @Column({ default: false })
  is_active: boolean;

  @OneToMany(() => UserAddress, (address) => address.user, {
    cascade: ['insert', 'update'],
  })
  addresses: UserAddress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
