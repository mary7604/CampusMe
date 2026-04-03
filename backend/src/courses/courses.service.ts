import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private repo: Repository<Course>,
  ) {}

  getWeekCourses(group: string, filiere: string) {
    return this.repo
      .createQueryBuilder('c')
      .where('c.group = :all OR c.group = :group', { all: 'all', group })
      .andWhere('c.filiere = :allF OR c.filiere = :filiere', { allF: 'all', filiere })
      .orderBy('c.day', 'ASC')
      .addOrderBy('c.time', 'ASC')
      .getMany();
  }

  getTodayCourses(group: string, filiere: string) {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    return this.repo
      .createQueryBuilder('c')
      .where('c.day = :day', { day: dayIndex })
      .andWhere('c.group = :all OR c.group = :group', { all: 'all', group })
      .andWhere('c.filiere = :allF OR c.filiere = :filiere', { allF: 'all', filiere })
      .orderBy('c.time', 'ASC')
      .getMany();
  }

  async seed() {
    const count = await this.repo.count();
    if (count > 0) return { message: 'Deja seede' };

    const courses = [
      { subject: 'Algorithmique',   professor: 'Dr. Amine',   room: 'Amphi A', time: '08:00 - 09:30', day: 0, group: 'all', filiere: 'all',                latitude: 33.6988, longitude: -7.3855 },
      { subject: 'React Native',    professor: 'Dr. Karim',   room: 'BAT X',   time: '10:00 - 11:30', day: 0, group: 'all', filiere: 'Genie Informatique', latitude: 33.6992, longitude: -7.3848 },
      { subject: 'Base de donnees', professor: 'Dr. Sara',    room: 'BAT D',   time: '14:00 - 15:30', day: 0, group: 'all', filiere: 'Genie Informatique', latitude: 33.6984, longitude: -7.3852 },
      { subject: 'Mathematiques',   professor: 'Dr. Nadia',   room: 'Amphi B', time: '09:00 - 10:30', day: 1, group: 'all', filiere: 'all',                latitude: 33.6990, longitude: -7.3852 },
      { subject: 'Reseaux',         professor: 'Dr. Youssef', room: 'BAT E',   time: '11:00 - 12:30', day: 1, group: 'all', filiere: 'Genie Informatique', latitude: 33.6984, longitude: -7.3858 },
      { subject: 'NestJS Backend',  professor: 'Dr. Karim',   room: 'BAT C',   time: '08:00 - 09:30', day: 2, group: 'all', filiere: 'Genie Informatique', latitude: 33.6984, longitude: -7.3845 },
      { subject: 'Anglais Tech',    professor: 'Mme. Leila',  room: 'BAT Y',   time: '10:00 - 11:30', day: 3, group: 'all', filiere: 'all',                latitude: 33.6988, longitude: -7.3865 },
      { subject: 'Projet Mobile',   professor: 'Dr. Karim',   room: 'BAT F',   time: '09:00 - 12:00', day: 4, group: 'all', filiere: 'Genie Informatique', latitude: 33.6984, longitude: -7.3864 },
    ];

    await this.repo.save(courses.map(c => this.repo.create(c)));
    return { message: `${courses.length} cours inseres` };
  }
}