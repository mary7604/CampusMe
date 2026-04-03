import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('courses')
export class CoursesController {
  constructor(private service: CoursesService) {}

  @Get('week')
  @UseGuards(JwtAuthGuard)
  getWeek(@Req() req: any) {
    return this.service.getWeekCourses(req.user.group, req.user.filiere);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  getToday(@Req() req: any) {
    return this.service.getTodayCourses(req.user.group, req.user.filiere);
  }

  @Post('seed')
  seed() {
    return this.service.seed();
  }
}