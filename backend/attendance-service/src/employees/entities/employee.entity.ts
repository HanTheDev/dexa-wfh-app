import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column({ name: 'employee_code', length: 20 })
  employeeCode: string;

  @Column({ length: 100, nullable: true })
  position: string;

  @Column({ length: 100, nullable: true })
  department: string;
}