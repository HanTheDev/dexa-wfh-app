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
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee not found for user ID ${userId}`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    // Get employee first
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Update user data jika fullName disediakan
    if (updateEmployeeDto.fullName) {
      await this.usersRepository.update(
        { id: employee.userId },
        { fullName: updateEmployeeDto.fullName }
      );
    }

    // Build update data for employee
    const updateData: any = {};
    
    if (updateEmployeeDto.position !== undefined) {
      updateData.position = updateEmployeeDto.position;
    }
    if (updateEmployeeDto.department !== undefined) {
      updateData.department = updateEmployeeDto.department;
    }
    if (updateEmployeeDto.phone !== undefined) {
      updateData.phone = updateEmployeeDto.phone;
    }
    if (updateEmployeeDto.address !== undefined) {
      updateData.address = updateEmployeeDto.address;
    }
    if (updateEmployeeDto.joinDate !== undefined) {
      updateData.joinDate = updateEmployeeDto.joinDate;
    }
    if (updateEmployeeDto.status !== undefined) {
      updateData.status = updateEmployeeDto.status;
    }

    // Only update if there's data to update
    if (Object.keys(updateData).length > 0) {
      await this.employeesRepository.update({ id }, updateData);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Hard delete: hapus employee dan user
    // Karena ada foreign key CASCADE, delete employee akan otomatis delete attendances
    await this.employeesRepository.delete({ id });
    
    // Delete user juga
    await this.usersRepository.delete({ id: employee.userId });

    return {
      message: 'Employee deleted successfully',
      id,
    };
  }
}