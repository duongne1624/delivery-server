import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
