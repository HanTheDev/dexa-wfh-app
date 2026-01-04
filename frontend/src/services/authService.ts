import api from './api';
import { LoginRequest, LoginResponse, User } from '../types';
import { ENDPOINTS, TOKEN_KEY, USER_KEY } from '../utils/constants';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Save token and user
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};