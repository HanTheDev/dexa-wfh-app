import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createEmployeeDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check if employee code already exists
    const existingEmployee = await this.employeesRepository.findOne({
      where: { employeeCode: createEmployeeDto.employeeCode },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee code already exists');
    }

    // Create user first
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
    const user = this.usersRepository.create({
      email: createEmployeeDto.email,
      password: hashedPassword,
      fullName: createEmployeeDto.fullName,
      role: UserRole.EMPLOYEE,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create employee
    const employee = this.employeesRepository.create({
      userId: savedUser.id,
      employeeCode: createEmployeeDto.employeeCode,
      position: createEmployeeDto.position,
      department: createEmployeeDto.department,
      phone: createEmployeeDto.phone,
      address: createEmployeeDto.address,
      joinDate: createEmployeeDto.joinDate,
      status: createEmployeeDto.status,
    });

    const savedEmployee = await this.employeesRepository.save(employee);

    // Return employee with user data
    return this.findOne(savedEmployee.id);
  }

  async findAll(query: QueryEmployeeDto) {
    const { search, department, status, page = 1, limit = 10 } = query;

    const queryBuilder = this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .select([
        'employee',
        'user.id',
        'user.email',
        'user.fullName',
        'user.role',
        'user.isActive',
      ]);

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.fullName LIKE :search OR employee.employeeCode LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Department filter
    if (department) {
      queryBuilder.andWhere('employee.department = :department', {
        department,
      });
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status });
    }

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
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        employeeCode: true,
        position: true,
        department: true,
        phone: true,
        address: true,
        joinDate: true,
        status: true,
        user: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          // no password
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findByUserId(userId: number) {
    const employee = await this.employeesRepository.findOne({
      where: { userId },
      relations: ['user'],
      select: {
        id: true,
        employeeCode: true,
        position: true,
        department: true,
        phone: true,
        address: true,
        joinDate: true,
        status: true,
        user: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          // no password
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee not found for user ID ${userId}`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    // Update user data if fullName is provided
    if (updateEmployeeDto.fullName) {
      await this.usersRepository.update(
        { id: employee.userId }, // FIX: Use object instead of plain number
        { fullName: updateEmployeeDto.fullName },
      );
    }

    // Update employee data - assign to object first
    if (updateEmployeeDto.position)
      employee.position = updateEmployeeDto.position;
    if (updateEmployeeDto.department)
      employee.department = updateEmployeeDto.department;
    if (updateEmployeeDto.phone) employee.phone = updateEmployeeDto.phone;
    if (updateEmployeeDto.address !== undefined)
      employee.address = updateEmployeeDto.address;
    if (updateEmployeeDto.joinDate)
      employee.joinDate = updateEmployeeDto.joinDate as any;
    if (updateEmployeeDto.status)
      employee.status = updateEmployeeDto.status as any;

    // Save the updated employee
    await this.employeesRepository.save(employee);

    return this.findOne(id);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);

    // Soft delete: set status to inactive
    employee.status = 'inactive' as any;
    await this.employeesRepository.save(employee);

    // Also deactivate user
    await this.usersRepository.update(employee.userId, { isActive: false });

    return {
      message: 'Employee deleted successfully',
      id,
    };
  }
}
