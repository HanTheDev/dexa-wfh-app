export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
  },
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id: number) => `/employees/${id}`,
    UPDATE: (id: number) => `/employees/${id}`,
    DELETE: (id: number) => `/employees/${id}`,
  },
  ATTENDANCES: {
    CLOCK_IN: '/attendances/clock-in',
    CLOCK_OUT: (id: number) => `/attendances/${id}/clock-out`,
    MY_ATTENDANCES: '/attendances/my-attendances',
    TODAY_STATUS: '/attendances/today-status',
    LIST: '/attendances',
    TODAY: '/attendances/today',
    BY_EMPLOYEE: (id: number) => `/attendances/employee/${id}`,
  },
};

export const TOKEN_KEY = 'dexa_wfh_token';
export const USER_KEY = 'dexa_wfh_user';