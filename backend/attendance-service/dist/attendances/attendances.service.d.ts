import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../employees/entities/employee.entity';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
export declare class AttendancesService {
    private attendancesRepository;
    private employeesRepository;
    constructor(attendancesRepository: Repository<Attendance>, employeesRepository: Repository<Employee>);
    clockIn(userId: number, clockInDto: ClockInDto, photoPath: string): Promise<Attendance>;
    clockOut(id: number, userId: number, clockOutDto: ClockOutDto): Promise<Attendance>;
    findAll(query: QueryAttendanceDto): Promise<{
        data: Attendance[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<Attendance>;
    findByEmployee(employeeId: number, query: QueryAttendanceDto): Promise<{
        data: Attendance[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyAttendances(userId: number, query: QueryAttendanceDto): Promise<{
        data: Attendance[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTodayAttendances(): Promise<Attendance[]>;
    checkTodayStatus(userId: number): Promise<{
        hasClockedIn: boolean;
        attendance: Attendance | null;
    }>;
    private calculateStatus;
}
