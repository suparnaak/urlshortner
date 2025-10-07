import type { AuthResponse, LoginData, RegisterData, User } from '../types';
import api from './api';
import { API_ENDPOINTS } from './endpoints';


export const authService = {
  // Register user
  register: async (registerData: RegisterData): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
  },

  // Login user
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Get current user profile
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {}, { withCredentials: true });
  },
};