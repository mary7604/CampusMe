import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  student: User;

  @Column() subject: string;
  @Column({ type: 'float' }) note: number;
  @Column() coef: number;
  @Column() semester: string;
  @Column() professor: string;
}

