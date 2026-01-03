import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendancesService } from './attendances.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { multerConfig } from '../config/multer.config';

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('clock-in')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  clockIn(
    @Request() req,
    @Body() clockInDto: ClockInDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Photo is required');
    }

    const photoPath = `/uploads/attendances/${file.filename}`;
    return this.attendancesService.clockIn(req.user.id, clockInDto, photoPath);
  }

  @Put(':id/clock-out')
  clockOut(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() clockOutDto: ClockOutDto,
  ) {
    return this.attendancesService.clockOut(id, req.user.id, clockOutDto);
  }

  @Get()
  @Roles('admin')
  findAll(@Query() query: QueryAttendanceDto) {
    return this.attendancesService.findAll(query);
  }

  @Get('my-attendances')
  findMyAttendances(@Request() req, @Query() query: QueryAttendanceDto) {
    return this.attendancesService.findMyAttendances(req.user.id, query);
  }

  @Get('today')
  @Roles('admin')
  getTodayAttendances() {
    return this.attendancesService.getTodayAttendances();
  }

  @Get('today-status')
  checkTodayStatus(@Request() req) {
    return this.attendancesService.checkTodayStatus(req.user.id);
  }

  @Get('employee/:employeeId')
  @Roles('admin')
  findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query() query: QueryAttendanceDto,
  ) {
    return this.attendancesService.findByEmployee(employeeId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesService.findOne(id);
  }
}
