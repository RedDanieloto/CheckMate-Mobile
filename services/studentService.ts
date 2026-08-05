import { ENDPOINTS } from '../config/env';
import { StudentProfile } from '../types/student';
import { apiClient } from './api';

export const studentService = {
  /**
   * Obtiene el perfil del alumno autenticado
   * Ruta backend: GET /api/v1/alumno/profile
   */
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<{ data: StudentProfile; message?: string }>(ENDPOINTS.ALUMNO.PROFILE);
    return response.data || (response as unknown as StudentProfile);
  },
};
