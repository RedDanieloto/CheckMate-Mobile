import { ENDPOINTS } from '../config/env';
import { LoginRequest, LoginResponse } from '../types/auth';
import { apiClient, setAuthToken } from './api';

export const authService = {
  /**
   * Inicia sesión en la API (consumiendo endpoint de Gobernanza desde móvil)
   * Ruta backend: /api/v1/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const payload: LoginRequest = {
      email: credentials.email,
      password: credentials.password,
      device_name: credentials.device_name || 'checkmate-mobile',
    };

    const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload);

    // Si la respuesta incluye token, lo asignamos automáticamente al cliente HTTP
    const token = response.token || response.access_token;
    if (token) {
      setAuthToken(token);
    }

    return response;
  },

  /**
   * Cierra la sesión localmente
   */
  logout() {
    setAuthToken(null);
  },
};
