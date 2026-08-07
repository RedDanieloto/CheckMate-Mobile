import { ENDPOINTS } from '../config/env';
import { StudentProfile } from '../types/student';
import { apiClient } from './api';

export const studentService = {
  /**
   * Obtiene el perfil del alumno autenticado
   * Ruta backend: GET /api/v1/alumno/profile
   */
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<any>(ENDPOINTS.ALUMNO.PROFILE);
    const profile = response?.data?.data || response?.data || response;
    return profile as StudentProfile;
  },
};
