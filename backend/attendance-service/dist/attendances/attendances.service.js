"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
let AttendancesService = class AttendancesService {
    attendancesRepository;
    employeesRepository;
    constructor(attendancesRepository, employeesRepository) {
        this.attendancesRepository = attendancesRepository;
        this.employeesRepository = employeesRepository;
    }
    async clockIn(userId, clockInDto, photoPath) {
        const employee = await this.employeesRepository.findOne({
            where: { userId },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const existingAttendance = await this.attendancesRepository.findOne({
            where: {
                employeeId: employee.id,
                date: (0, typeorm_2.Between)(today, tomorrow),
            },
        });
        if (existingAttendance) {
            throw new common_1.ConflictException('Already clocked in today');
        }
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
    async clockOut(id, userId, clockOutDto) {
        const attendance = await this.attendancesRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance not found');
        }
        if (attendance.employee.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized to clock out this attendance');
        }
        if (attendance.clockOut) {
            throw new common_1.BadRequestException('Already clocked out');
        }
        const now = new Date();
        const duration = Math.floor((now.getTime() - new Date(attendance.clockIn).getTime()) / (1000 * 60));
        attendance.clockOut = now;
        attendance.workDuration = duration;
        if (clockOutDto.notes) {
            attendance.notes = clockOutDto.notes;
        }
        await this.attendancesRepository.save(attendance);
        return this.findOne(id);
    }
    async findAll(query) {
        const { startDate, endDate, employeeId, status, page = 1, limit = 10, } = query;
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
        if (startDate && endDate) {
            queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        else if (startDate) {
            queryBuilder.andWhere('attendance.date >= :startDate', { startDate });
        }
        else if (endDate) {
            queryBuilder.andWhere('attendance.date <= :endDate', { endDate });
        }
        if (employeeId) {
            queryBuilder.andWhere('attendance.employeeId = :employeeId', {
                employeeId,
            });
        }
        if (status) {
            queryBuilder.andWhere('attendance.status = :status', { status });
        }
        queryBuilder.orderBy('attendance.date', 'DESC');
        queryBuilder.addOrderBy('attendance.clockIn', 'DESC');
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
    async findOne(id) {
        const attendance = await this.attendancesRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance with ID ${id} not found`);
        }
        return attendance;
    }
    async findByEmployee(employeeId, query) {
        return this.findAll({ ...query, employeeId });
    }
    async findMyAttendances(userId, query) {
        const employee = await this.employeesRepository.findOne({
            where: { userId },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return this.findAll({ ...query, employeeId: employee.id });
    }
    async getTodayAttendances() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const attendances = await this.attendancesRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.employee', 'employee')
            .leftJoinAndSelect('employee.user', 'user')
            .where('attendance.date BETWEEN :today AND :tomorrow', {
            today,
            tomorrow,
        })
            .orderBy('attendance.clockIn', 'DESC')
            .getMany();
        return attendances;
    }
    async checkTodayStatus(userId) {
        const employee = await this.employeesRepository.findOne({
            where: { userId },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const attendance = await this.attendancesRepository.findOne({
            where: {
                employeeId: employee.id,
                date: (0, typeorm_2.Between)(today, tomorrow),
            },
        });
        return {
            hasClockedIn: !!attendance,
            attendance: attendance || null,
        };
    }
    calculateStatus(clockIn) {
        const hour = clockIn.getHours();
        return hour >= 9 ? attendance_entity_1.AttendanceStatus.LATE : attendance_entity_1.AttendanceStatus.PRESENT;
    }
};
exports.AttendancesService = AttendancesService;
exports.AttendancesService = AttendancesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendancesService);
//# sourceMappingURL=attendances.service.js.map