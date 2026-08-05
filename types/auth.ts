export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

export interface User {
  id?: number | string;
  name?: string;
  email: string;
  role?: 'profesor' | 'tutor_academico' | 'alumno' | 'administrator' | 'career_director' | string;
  active?: boolean;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: User;
  message?: string;
  data?: {
    token?: string;
    access_token?: string;
    user?: User;
  };
  [key: string]: any;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
