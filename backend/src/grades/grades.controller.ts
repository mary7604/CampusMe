import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private gradesService: GradesService) {}

  // GET /grades/42
  @Get(':studentId')
  getGrades(@Param('studentId') studentId: string) {
    return this.gradesService.getGrades(+studentId);
  }
}
