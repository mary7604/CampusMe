import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Req, UnauthorizedException
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  // Tous les etudiants — filtré par leur groupe/filiere
  @Get('my')
  getForMe(@Req() req: any) {
    return this.service.findForStudent(req.user.group, req.user.filiere);
  }

  // Toutes les annonces (pour le prof)
  @Get()
  getAll() {
    return this.service.findAll();
  }

  // Créer
  @Post()
  create(@Body() body: any, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.service.create({
      title: body.title,
      content: body.content,
      profName: body.profName,
      targetGroup: body.targetGroup || 'all',
      targetFiliere: body.targetFiliere || 'all',
    });
  }

  // Modifier
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.service.update(+id, body);
  }

  // Supprimer
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'professeur')
      throw new UnauthorizedException('Acces reserve aux professeurs');
    return this.service.remove(+id);
  }
}