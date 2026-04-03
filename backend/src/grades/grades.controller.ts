import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Req, UnauthorizedException
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private gradesService: GradesService) {}

  @Get('me')
  getMyGrades(@Req() req: any) {
    return this.gradesService.getGrades(req.user.sub);
  }

  @Get(':studentId')
  getGrades(@Param('studentId') studentId: string) {
    return this.gradesService.getGrades(+studentId);
  }

  @Post()
  addGrade(@Body() body: any, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.gradesService.addGrade(body.studentId, {
      subject: body.subject,
      note: body.note,
      coef: body.coef,
      semester: body.semester,
      professor: req.user.email,
    });
  }

  @Patch(':id')
  updateGrade(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.gradesService.updateGrade(+id, body);
  }

  @Delete(':id')
  deleteGrade(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.gradesService.deleteGrade(+id);
  }
}