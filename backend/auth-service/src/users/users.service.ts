import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,  
  ) {}

  async create(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
  ): Promise<User> {  
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName,
      role,  
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {  
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {  
    return this.usersRepository.findOne({ where: { id } });
  }
}