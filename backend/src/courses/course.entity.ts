import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  professor: string;

  @Column()
  room: string;

  @Column()
  time: string;

  @Column()
  day: number; // 0=Lundi, 1=Mardi ... 5=Samedi

  @Column({ default: 'all' })
  group: string;

  @Column({ default: 'all' })
  filiere: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;
}