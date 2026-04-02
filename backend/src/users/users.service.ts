import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getStudents() {
    return this.usersRepository.find({
      where: { role: 'student' },
      select: ['id', 'firstName', 'lastName', 'email', 'filiere', 'niveau', 'group'],
    });
  }
}

