import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'employee_code', length: 20 })
  employeeCode: string;

  @Column({ length: 100, nullable: true })
  position: string;

  @Column({ length: 100, nullable: true })
  department: string;
}