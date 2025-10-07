
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Url {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface CreateUrlData {
  originalUrl: string;
  customCode?: string;
}

export interface UrlsResponse {
  urls: Url[];
  total?: number;
  message?: string;
}

export interface ShortenResponse {
  shortUrl: string;
  url?: Url;
  isExisting?: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}