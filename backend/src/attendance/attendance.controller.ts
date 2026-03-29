import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  // Prof génère un QR code
  @Post('generate/:courseId')
  generate(@Param('courseId') courseId: string) {
    return { qrCode: this.attendanceService.generateQRCode(+courseId) };
  }

  // Étudiant scanne
  @Post('scan')
  scan(@Body() body: { code: string }, @Req() req) {
    return this.attendanceService.scanQRCode(body.code, req.user.sub);
  }

  // Historique
  @Get('history')
  history(@Req() req) {
    return this.attendanceService.getHistory(req.user.sub);
  }
}
