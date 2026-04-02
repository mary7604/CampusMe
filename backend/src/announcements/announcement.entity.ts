import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  profName: string;

  @Column({ default: 'all' })
  targetGroup: string;

  @Column({ default: 'all' })
  targetFiliere: string;

  @CreateDateColumn()
  createdAt: Date;
}