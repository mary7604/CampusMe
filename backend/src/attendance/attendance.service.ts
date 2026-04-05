import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

const activeQRCodes = new Map<string, { courseId: number; subject: string; expiresAt: Date }>();

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  generateQRCode(courseId: number, subject: string): string {
    const code = `FSTM-${courseId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    activeQRCodes.set(code, { courseId, subject, expiresAt });
    return code;
  }

  async scanQRCode(code: string, studentId: number) {
    const qr = activeQRCodes.get(code);
    if (!qr) throw new BadRequestException('QR code invalide');
    if (new Date() > qr.expiresAt)
      throw new BadRequestException('QR code expire');

    const attendance = this.attendanceRepo.create({
      student: { id: studentId },
      subject: qr.subject || 'Cours',
      qrCode: code,
      status: 'present',
    });
    await this.attendanceRepo.save(attendance);
    activeQRCodes.delete(code);
    return { message: 'Presence enregistree' };
  }

  async getHistory(studentId: number) {
    const records = await this.attendanceRepo.find({
      where: { student: { id: studentId } },
      order: { date: 'DESC' },
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { records, total, present, absent, rate };
  }

  async seedAttendances(studentId: number) {
    const count = await this.attendanceRepo.count({
      where: { student: { id: studentId } },
    });
    if (count > 0) return { message: 'Deja seede' };

    const subjects = ['Algorithmique', 'React Native', 'Base de donnees', 'Mathematiques', 'Reseaux'];
    const records = [];

    for (let i = 0; i < 20; i++) {
      records.push(this.attendanceRepo.create({
        student: { id: studentId },
        subject: subjects[i % subjects.length],
        status: i % 5 === 0 ? 'absent' : 'present',
        qrCode: `TEST-${i}`,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));
    }

    await this.attendanceRepo.save(records);
    return { message: '20 presences inserees' };
  }
}