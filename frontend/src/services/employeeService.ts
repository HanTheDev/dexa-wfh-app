import api from './api';
import { Employee, CreateEmployeeRequest, PaginatedResponse } from '../types';
import { ENDPOINTS } from '../utils/constants';

export const employeeService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
  }): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get<PaginatedResponse<Employee>>(
      ENDPOINTS.EMPLOYEES.LIST,
      { params }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(ENDPOINTS.EMPLOYEES.GET(id));
    return response.data;
  },

  create: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post<Employee>(ENDPOINTS.EMPLOYEES.CREATE, data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateEmployeeRequest>): Promise<Employee> => {
    const response = await api.patch<Employee>(ENDPOINTS.EMPLOYEES.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.EMPLOYEES.DELETE(id));
  },
};