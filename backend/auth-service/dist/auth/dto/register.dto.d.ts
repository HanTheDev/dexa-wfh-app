import { UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
}
