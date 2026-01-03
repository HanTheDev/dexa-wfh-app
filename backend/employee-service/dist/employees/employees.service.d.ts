import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
export declare class EmployeesService {
    private employeesRepository;
    private usersRepository;
    constructor(employeesRepository: Repository<Employee>, usersRepository: Repository<User>);
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    findAll(query: QueryEmployeeDto): Promise<{
        data: Employee[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<Employee>;
    findByUserId(userId: number): Promise<Employee>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
