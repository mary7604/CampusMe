import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() subject: string;
  @Column() room: string;
  @Column() professor: string;
  @Column() time: string;
  @Column() day: number;
  @Column({ type: 'float' }) latitude: number;
  @Column({ type: 'float' }) longitude: number;
  @Column() group: string;
  @Column({ default: '#1565C0' }) color: string;
}
