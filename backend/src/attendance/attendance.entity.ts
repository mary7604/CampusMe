import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ default: 'present' }) status: string;
  @Column({ nullable: true }) qrCode: string;

  @CreateDateColumn()
  date: Date;
}
