import { Employee } from '../../employees/entities/employee.entity';
export declare enum AttendanceStatus {
    PRESENT = "present",
    LATE = "late",
    ABSENT = "absent"
}
export declare class Attendance {
    id: number;
    employeeId: number;
    employee: Employee;
    date: Date;
    clockIn: Date;
    clockOut: Date;
    photoUrl: string;
    notes: string;
    workDuration: number;
    status: AttendanceStatus;
    createdAt: Date;
    updatedAt: Date;
}
