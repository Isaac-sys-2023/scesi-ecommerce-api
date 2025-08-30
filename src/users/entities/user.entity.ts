import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn
} from 'typeorm';
import { Profile } from './profile.entity';

export type UserRole = 'customer' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column() // hash bcrypt
  password: string;

  @Column({ type: 'varchar', default: 'customer' })
  role: UserRole;

  @OneToOne(() => Profile, (p) => p.user, { cascade: true, eager: true })
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
