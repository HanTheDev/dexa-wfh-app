export declare enum UserRole {
    ADMIN = "admin",
    EMPLOYEE = "employee"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
