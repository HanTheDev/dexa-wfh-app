import { User } from '../../users/entities/user.entity';
export declare enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    RESIGNED = "resigned"
}
export declare class Employee {
    id: number;
    userId: number;
    user: User;
    employeeCode: string;
    position: string;
    department: string;
    phone: string;
    address: string;
    joinDate: Date;
    photoUrl: string;
    status: EmployeeStatus;
    createdAt: Date;
    updatedAt: Date;
}
