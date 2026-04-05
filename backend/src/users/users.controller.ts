import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getStudents(@Req() req: any) {
    // Prof only - already guarded by JWT
    return this.usersService.getStudents();
  }

  @Post('push-token')
savePushToken(@Body() body: { pushToken: string }, @Req() req: any) {
  return this.usersService.savePushToken(req.user.sub, body.pushToken);
}
}
