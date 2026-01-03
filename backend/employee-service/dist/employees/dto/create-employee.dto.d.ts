import { EmployeeStatus } from '../entities/employee.entity';
export declare class CreateEmployeeDto {
    email: string;
    password: string;
    fullName: string;
    employeeCode: string;
    position?: string;
    department?: string;
    phone?: string;
    address?: string;
    joinDate?: string;
    status?: EmployeeStatus;
}
