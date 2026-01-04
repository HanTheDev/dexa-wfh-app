export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Employee {
  id: number;
  userId: number;
  employeeCode: string;
  position: string;
  department: string;
  phone: string;
  address?: string;
  joinDate: string;
  photoUrl?: string;
  status: 'active' | 'inactive' | 'resigned';
  user?: User;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  fullName: string;
  employeeCode: string;
  position: string;
  department: string;
  phone: string;
  address?: string;
  joinDate: string;
  status?: 'active' | 'inactive' | 'resigned';
}

export interface Attendance {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  clockIn: string;
  clockOut?: string;
  photoUrl: string;
  notes?: string;
  workDuration?: number;
  status: 'present' | 'late' | 'absent';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: any;
  timestamp: string;
}