import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
}
