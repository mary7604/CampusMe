import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    firstName: string; lastName: string;
    email: string; password: string;
    filiere?: string; niveau?: string; group?: string;
    role?: string;
    departement?: string;
  }) {
    console.log('Register attempt:', data.email, data.role);
    const exists = await this.usersRepo.findOne({ where: { email: data.email } });
    if (exists) {
      throw new ConflictException('Email déjà utilisé');
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.usersRepo.create({ ...data, password: hashed });
    const saved = await this.usersRepo.save(user);
    console.log('User created:', saved.id);
    return { message: 'Compte créé avec succès' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    const { password: _, ...userWithoutPassword } = user;
    return { message: 'Connexion réussie', access_token, user: userWithoutPassword };
  }

  async getMe(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async resetPassword(email: string, newPassword: string) {
  const user = await this.usersRepo.findOne({ where: { email } });
  if (!user) throw new UnauthorizedException('Email introuvable');
  const hashed = await bcrypt.hash(newPassword, 10);
  await this.usersRepo.update(user.id, { password: hashed });
  return { message: 'Mot de passe modifié avec succès' };
}
}