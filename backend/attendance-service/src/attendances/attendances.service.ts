import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { Employee } from '../employees/entities/employee.entity';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}
  
  async clockIn(userId: number, clockInDto: ClockInDto, photoPath: string) {
    // Find employee by userId
    const employee = await this.employeesRepository.findOne({
      where: { userId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check if already clocked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await this.attendancesRepository.findOne({
      where: {
        employeeId: employee.id,
        date: Between(today, tomorrow),
      },
    });

    if (existingAttendance) {
      throw new ConflictException('Already clocked in today');
    }

    // Create attendance
    const now = new Date();
    const attendance = this.attendancesRepository.create({
      employeeId: employee.id,
      date: today,
      clockIn: now,
      photoUrl: photoPath,
      notes: clockInDto.notes,
      status: this.calculateStatus(now),
    });

    const saved = await this.attendancesRepository.save(attendance);
    return this.findOne(saved.id);
  }
  
  async clockOut(id: number, userId: number, clockOutDto: ClockOutDto) {
    const attendance = await this.attendancesRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    // Verify ownership
    if (attendance.employee.userId !== userId) {
      throw new BadRequestException(
        'Unauthorized to clock out this attendance',
      );
    }

    if (attendance.clockOut) {
      throw new BadRequestException('Already clocked out');
    }

    const now = new Date();
    const duration = Math.floor(
      (now.getTime() - new Date(attendance.clockIn).getTime()) / (1000 * 60),
    );

    attendance.clockOut = now;
    attendance.workDuration = duration;
    if (clockOutDto.notes) {
      attendance.notes = clockOutDto.notes;
    }

    await this.attendancesRepository.save(attendance);
    return this.findOne(id);
  }
  
  async findAll(query: QueryAttendanceDto) {
    const {
      startDate,
      endDate,
      employeeId,
      status,
      page = 1,
      limit = 10,
    } = query;
    
    // FIX: Perbaiki query builder dengan alias yang benar
    const queryBuilder = this.attendancesRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .leftJoinAndSelect('employee.user', 'user')
      .select([
        'attendance',
        'employee.id',
        'employee.employeeCode',
        'employee.userId',
        'employee.position',
        'employee.department',
        'user.id', 
        'user.fullName', 
        'user.email',
      ]);

    // Date range filter
    if (startDate && endDate) {
      queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('attendance.date >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('attendance.date <= :endDate', { endDate });
    }

    // Employee filter
    if (employeeId) {
      queryBuilder.andWhere('attendance.employeeId = :employeeId', {
        employeeId,
      });
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('attendance.status = :status', { status });
    }

    // Order by date and clock in time
    queryBuilder.orderBy('attendance.date', 'DESC');
    queryBuilder.addOrderBy('attendance.clockIn', 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async findOne(id: number) {
    const attendance = await this.attendancesRepository.findOne({
      where: { id },
      relations: ['employee', 'employee.user'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }
  
  async findByEmployee(employeeId: number, query: QueryAttendanceDto) {
    return this.findAll({ ...query, employeeId });
  }
  
  async findMyAttendances(userId: number, query: QueryAttendanceDto) {
    const employee = await this.employeesRepository.findOne({
      where: { userId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.findAll({ ...query, employeeId: employee.id });
  }
  
  async getTodayAttendances() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // FIX: Gunakan findMany dengan relations yang proper
    const attendances = await this.attendancesRepository.find({
      where: {
        date: Between(today, tomorrow),
      },
      relations: ['employee', 'employee.user'],
      order: {
        clockIn: 'DESC',
      },
    });

    return attendances;
  }
  
  async checkTodayStatus(userId: number) {
    const employee = await this.employeesRepository.findOne({
      where: { userId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await this.attendancesRepository.findOne({
      where: {
        employeeId: employee.id,
        date: Between(today, tomorrow),
      },
      relations: ['employee', 'employee.user'],
    });

    return {
      hasClockedIn: !!attendance,
      attendance: attendance || null,
    };
  }
  
  private calculateStatus(clockIn: Date): AttendanceStatus {
    const hour = clockIn.getHours();
    // Late if clock in after 9 AM
    return hour >= 9 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
  }
}