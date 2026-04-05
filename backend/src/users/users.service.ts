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

  async savePushToken(userId: number, pushToken: string) {
  await this.usersRepository.update(userId, { pushToken });
  return { message: 'Token sauvegardé' };
}
}

