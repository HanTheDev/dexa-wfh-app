import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../employees/entities/employee.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Employee]),
    PassportModule,
    MulterModule.register({
      dest: './uploads/attendances',
    }),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService, JwtStrategy, RolesGuard],
  exports: [AttendancesService],
})
export class AttendancesModule {}
