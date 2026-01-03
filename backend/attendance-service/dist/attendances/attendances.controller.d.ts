import { AttendancesService } from './attendances.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
export declare class AttendancesController {
    private readonly attendancesService;
    constructor(attendancesService: AttendancesService);
    clockIn(req: any, clockInDto: ClockInDto, file: Express.Multer.File): Promise<import("./entities/attendance.entity").Attendance>;
    clockOut(id: number, req: any, clockOutDto: ClockOutDto): Promise<import("./entities/attendance.entity").Attendance>;
    findAll(query: QueryAttendanceDto): Promise<{
        data: import("./entities/attendance.entity").Attendance[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyAttendances(req: any, query: QueryAttendanceDto): Promise<{
        data: import("./entities/attendance.entity").Attendance[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTodayAttendances(): Promise<import("./entities/attendance.entity").Attendance[]>;
    checkTodayStatus(req: any): Promise<{
        hasClockedIn: boolean;
        attendance: import("./entities/attendance.entity").Attendance | null;
    }>;
    findByEmployee(employeeId: number, query: QueryAttendanceDto): Promise<{
        data: import("./entities/attendance.entity").Attendance[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<import("./entities/attendance.entity").Attendance>;
}
