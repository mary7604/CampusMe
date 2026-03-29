import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepo: Repository<Course>,
  ) {}

  findByGroup(group: string) {
    return this.coursesRepo.find({ where: { group } });
  }

  findByDayAndGroup(day: number, group: string) {
    return this.coursesRepo.find({ where: { day, group } });
  }
}
