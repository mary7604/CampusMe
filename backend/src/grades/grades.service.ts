import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './grade.entity';
import {  NotFoundException } from '@nestjs/common';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepo: Repository<Grade>,
  ) {}

  async getGrades(studentId: number) {
    const grades = await this.gradesRepo.find({
      where: { student: { id: studentId } },
    });

    // Calcul moyenne générale
    const total = grades.reduce((sum, g) => sum + g.note * g.coef, 0);
    const coefs = grades.reduce((sum, g) => sum + g.coef, 0);
    const average = coefs > 0 ? (total / coefs).toFixed(2) : 0;

    return { grades, average };
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
  async addGrade(studentId: number, data: any) {
    const grade = this.gradesRepo.create({
      ...data,
      student: { id: studentId },
    });
    return this.gradesRepo.save(grade);
  }
}

