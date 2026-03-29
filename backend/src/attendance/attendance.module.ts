import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import { Course } from '../courses/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Course])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
