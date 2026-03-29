import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Course } from '../courses/course.entity';

// Stockage temporaire des QR codes actifs (en mémoire)
const activeQRCodes = new Map<string, { courseId: number; expiresAt: Date }>();

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Course)
    private coursesRepo: Repository<Course>,
  ) {}

  // Prof génère un QR code — valable 5 minutes
  generateQRCode(courseId: number): string {
    const code = `FSTM-${courseId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // +5min
    activeQRCodes.set(code, { courseId, expiresAt });
    return code;
  }

  // Étudiant scanne le QR code
  async scanQRCode(code: string, studentId: number) {
    const qr = activeQRCodes.get(code);

    if (!qr) throw new BadRequestException('QR code invalide');
    if (new Date() > qr.expiresAt)
      throw new BadRequestException('QR code expiré — demande un nouveau');

    const course = await this.coursesRepo.findOne({ where: { id: qr.courseId } });
    const attendance = this.attendanceRepo.create({
      student: { id: studentId },
      course,
      qrCode: code,
      status: 'present',
    });

    await this.attendanceRepo.save(attendance);
    activeQRCodes.delete(code); // Code utilisé une seule fois
    return { message: '✅ Présence enregistrée !' };
  }

  // Historique des présences d'un étudiant
  getHistory(studentId: number) {
    return this.attendanceRepo.find({
      where: { student: { id: studentId } },
      relations: ['course'],
      order: { date: 'DESC' },
    });
  }
}
