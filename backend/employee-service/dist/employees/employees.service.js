"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
let EmployeesService = class EmployeesService {
    employeesRepository;
    usersRepository;
    constructor(employeesRepository, usersRepository) {
        this.employeesRepository = employeesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createEmployeeDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createEmployeeDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const existingEmployee = await this.employeesRepository.findOne({
            where: { employeeCode: createEmployeeDto.employeeCode },
        });
        if (existingEmployee) {
            throw new common_1.ConflictException('Employee code already exists');
        }
        const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
        const user = this.usersRepository.create({
            email: createEmployeeDto.email,
            password: hashedPassword,
            fullName: createEmployeeDto.fullName,
            role: user_entity_1.UserRole.EMPLOYEE,
        });
        const savedUser = await this.usersRepository.save(user);
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
        return this.findOne(savedEmployee.id);
    }
    async findAll(query) {
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
        if (search) {
            queryBuilder.andWhere('(user.fullName LIKE :search OR employee.employeeCode LIKE :search)', { search: `%${search}%` });
        }
        if (department) {
            queryBuilder.andWhere('employee.department = :department', {
                department,
            });
        }
        if (status) {
            queryBuilder.andWhere('employee.status = :status', { status });
        }
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async findByUserId(userId) {
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
            throw new common_1.NotFoundException(`Employee not found for user ID ${userId}`);
        }
        return employee;
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        if (updateEmployeeDto.fullName) {
            await this.usersRepository.update({ id: employee.userId }, { fullName: updateEmployeeDto.fullName });
        }
        const updateData = {};
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
        if (Object.keys(updateData).length > 0) {
            await this.employeesRepository.update({ id }, updateData);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        await this.employeesRepository.delete({ id });
        await this.usersRepository.delete({ id: employee.userId });
        return {
            message: 'Employee deleted successfully',
            id,
        };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map