import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private repo: Repository<Announcement>,
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

  create(data: Partial<Announcement>) {
    const ann = this.repo.create(data);
    return this.repo.save(ann);
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