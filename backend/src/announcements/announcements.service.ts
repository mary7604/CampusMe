import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private repo: Repository<Announcement>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findForStudent(group: string, filiere: string) {
    return this.repo
      .createQueryBuilder('a')
      .where('a.targetGroup = :all OR a.targetGroup = :group', { all: 'all', group })
      .andWhere('a.targetFiliere = :allF OR a.targetFiliere = :filiere', { allF: 'all', filiere })
      .orderBy('a.createdAt', 'DESC')
      .getMany();
  }

  async create(data: Partial<Announcement>) {
    const ann = this.repo.create(data);
    const saved = await this.repo.save(ann);

    // Envoyer notification à tous les étudiants ciblés
    const students = await this.usersRepo.find({
      where: { role: 'student' },
    });

    const tokens = students
      .map(s => s.pushToken)
      .filter(t => t != null);

    if (tokens.length > 0) {
      await this.notificationsService.sendToMultiple(
        tokens,
        'Nouvelle annonce',
        `${data.profName} : ${data.title}`,
      );
    }

    return saved;
  }

  async update(id: number, data: Partial<Announcement>) {
    const ann = await this.repo.findOne({ where: { id } });
    if (!ann) throw new NotFoundException('Annonce introuvable');
    Object.assign(ann, data);
    return this.repo.save(ann);
  }

  async remove(id: number) {
    const ann = await this.repo.findOne({ where: { id } });
    if (!ann) throw new NotFoundException('Annonce introuvable');
    return this.repo.remove(ann);
  }
}