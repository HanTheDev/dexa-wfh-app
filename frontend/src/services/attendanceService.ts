import { uploadFile } from './api';
import api from './api';
import { Attendance, PaginatedResponse } from '../types';
import { ENDPOINTS, API_BASE_URL } from '../utils/constants';

export const attendanceService = {
  clockIn: async (photo: File, notes?: string): Promise<Attendance> => {
    const formData = new FormData();
    formData.append('photo', photo);
    if (notes) {
      formData.append('notes', notes);
    }

    const response = await uploadFile(ENDPOINTS.ATTENDANCES.CLOCK_IN, formData);
    return response.data;
  },

  clockOut: async (id: number, notes?: string): Promise<Attendance> => {
    const response = await api.put<Attendance>(
      ENDPOINTS.ATTENDANCES.CLOCK_OUT(id),
      { notes }
    );
    return response.data;
  },

  getMyAttendances: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Attendance>> => {
    const response = await api.get<PaginatedResponse<Attendance>>(
      ENDPOINTS.ATTENDANCES.MY_ATTENDANCES,
      { params }
    );
    return response.data;
  },

  getTodayStatus: async (): Promise<{
    hasClockedIn: boolean;
    attendance: Attendance | null;
  }> => {
    const response = await api.get(ENDPOINTS.ATTENDANCES.TODAY_STATUS);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    employeeId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<PaginatedResponse<Attendance>> => {
    const response = await api.get<PaginatedResponse<Attendance>>(
      ENDPOINTS.ATTENDANCES.LIST,
      { params }
    );
    return response.data;
  },

  getTodayAttendances: async (): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>(ENDPOINTS.ATTENDANCES.TODAY);
    return response.data;
  },

  getPhotoUrl: (photoUrl: string): string => {
    return `${API_BASE_URL.replace('/api', '')}${photoUrl}`;
  },
};