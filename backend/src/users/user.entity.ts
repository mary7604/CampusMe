import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'student' })
  role: string;

  @Column({ default: 'Génie Informatique' })
  filiere: string;

  @Column({ default: '1' })
  niveau: string;

  @Column({ default: 'Groupe A' })
  group: string;

  @Column({ nullable: true })
  departement: string;

  @Column({ nullable: true })
  pushToken: string;

  @CreateDateColumn()
  createdAt: Date;
}