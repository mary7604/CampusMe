import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  student: User;

  @Column({ nullable: true })
  subject: string;

  @Column({ default: 'present' })
  status: string;

  @Column({ nullable: true })
  qrCode: string;

  @CreateDateColumn()
  date: Date;
}