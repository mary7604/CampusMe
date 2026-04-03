import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

const activeQRCodes = new Map<string, { courseId: number; expiresAt: Date }>();

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  generateQRCode(courseId: number): string {
    const code = `FSTM-${courseId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    activeQRCodes.set(code, { courseId, expiresAt });
    return code;
  }

  async scanQRCode(code: string, studentId: number) {
    const qr = activeQRCodes.get(code);
    if (!qr) throw new BadRequestException('QR code invalide');
    if (new Date() > qr.expiresAt)
      throw new BadRequestException('QR code expire');

    const attendance = this.attendanceRepo.create({
      student: { id: studentId },
      qrCode: code,
      status: 'present',
    });
    await this.attendanceRepo.save(attendance);
    activeQRCodes.delete(code);
    return { message: 'Presence enregistree' };
  }

  getHistory(studentId: number) {
    return this.attendanceRepo.find({
      where: { student: { id: studentId } },
      order: { date: 'DESC' },
    });
  }
}