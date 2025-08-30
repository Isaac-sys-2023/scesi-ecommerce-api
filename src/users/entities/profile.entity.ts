import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true }) phone?: string;
  @Column({ nullable: true }) address?: string;
  @Column({ nullable: true }) city?: string;
  @Column({ nullable: true }) country?: string;

  @OneToOne(() => User, (u) => u.profile)
  user: User;
}
