import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  // GET /courses/week/GroupeA
  @Get('week/:group')
  getWeek(@Param('group') group: string) {
    return this.coursesService.findByGroup(group);
  }

  // GET /courses/today/GroupeA
  @Get('today/:group')
  getToday(@Param('group') group: string) {
    const today = new Date().getDay(); // 0=Dim, 1=Lun...
    const campusDay = today === 0 ? 6 : today - 1; // Adapter Lun=0
    return this.coursesService.findByDayAndGroup(campusDay, group);
  }
}
