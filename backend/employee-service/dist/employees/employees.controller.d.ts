import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    findAll(query: QueryEmployeeDto): Promise<{
        data: import("./entities/employee.entity").Employee[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyProfile(req: any): Promise<import("./entities/employee.entity").Employee>;
    findOne(id: number): Promise<import("./entities/employee.entity").Employee>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
