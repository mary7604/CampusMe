import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './grade.entity';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade, User]),
    NotificationsModule,
  ],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}