import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './grade.entity';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepo: Repository<Grade>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async getGrades(studentId: number) {
    const grades = await this.gradesRepo.find({
      where: { student: { id: studentId } },
    });
    const total = grades.reduce((sum, g) => sum + g.note * g.coef, 0);
    const coefs = grades.reduce((sum, g) => sum + g.coef, 0);
    const average = coefs > 0 ? (total / coefs).toFixed(2) : 0;
    return { grades, average };
  }

  async addGrade(studentId: number, data: any) {
    const grade = this.gradesRepo.create({
      ...data,
      student: { id: studentId },
    });
    const saved = await this.gradesRepo.save(grade);

    // Envoyer notification à l'étudiant
    const student = await this.usersRepo.findOne({
      where: { id: studentId },
    });

    if (student?.pushToken) {
      await this.notificationsService.sendPushNotification(
        student.pushToken,
        'Nouvelle note disponible',
        `Une note a été ajoutée en ${data.subject} : ${data.note}/20`,
      );
    }

    return saved;
  }

  async updateGrade(id: number, data: any) {
    const grade = await this.gradesRepo.findOne({ where: { id } });
    if (!grade) throw new NotFoundException('Note introuvable');
    Object.assign(grade, data);
    return this.gradesRepo.save(grade);
  }

  async deleteGrade(id: number) {
    const grade = await this.gradesRepo.findOne({ where: { id } });
    if (!grade) throw new NotFoundException('Note introuvable');
    return this.gradesRepo.remove(grade);
  }
}