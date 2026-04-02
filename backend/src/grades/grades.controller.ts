import {
  Controller, Get, Post, Body, Param,
  UseGuards, Req, UnauthorizedException
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private gradesService: GradesService) {}

  // Etudiant voit ses notes
  @Get('me')
  getMyGrades(@Req() req: any) {
    return this.gradesService.getGrades(req.user.sub);
  }

  // Prof voit les notes d'un étudiant
  @Get(':studentId')
  getGrades(@Param('studentId') studentId: string) {
    return this.gradesService.getGrades(+studentId);
  }

  // Prof saisit une note
  @Post()
  addGrade(@Body() body: any, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.gradesService.addGrade(body.studentId, {
      subject: body.subject,
      note: body.note,
      coef: body.coef,
      semester: body.semester,
      professor: `${req.user.email}`,
    });
  }
}