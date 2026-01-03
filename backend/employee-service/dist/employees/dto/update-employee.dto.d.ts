import { EmployeeStatus } from '../entities/employee.entity';
export declare class UpdateEmployeeDto {
    fullName?: string;
    position?: string;
    department?: string;
    phone?: string;
    address?: string;
    joinDate?: string;
    status?: EmployeeStatus;
}
