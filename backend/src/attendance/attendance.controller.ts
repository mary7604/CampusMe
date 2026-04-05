import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('generate/:courseId')
  generate(
    @Param('courseId') courseId: string,
    @Body() body: { subject?: string },
  ) {
    return {
      qrCode: this.attendanceService.generateQRCode(
        +courseId,
        body.subject || 'Cours',
      ),
    };
  }

  @Post('scan')
  scan(@Body() body: { code: string }, @Req() req) {
    return this.attendanceService.scanQRCode(body.code, req.user.sub);
  }

  @Get('history')
  history(@Req() req) {
    return this.attendanceService.getHistory(req.user.sub);
  }

  @Post('seed')
  seed(@Req() req) {
    return this.attendanceService.seedAttendances(req.user.sub);
  }
}