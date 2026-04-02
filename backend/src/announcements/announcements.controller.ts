import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  getAll() {
    return this.announcementsService.findAll();
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    if (req.user.role !== 'professeur') {
      throw new UnauthorizedException('Seul un professeur peut publier une annonce');
    }
    return this.announcementsService.create({
      title: body.title,
      content: body.content,
      profName: body.profName || (req.user.email ? req.user.email.split('@')[0] : 'Professeur'),
    });
  }
}
