import { ENDPOINTS } from '../config/env';
import { StudentProfile } from '../types/student';
import { SubjectItem, SubjectDetail, AttendanceRecord } from '../types/subject';
import { JustificationItem } from '../types/justification';
import { ClaimItem } from '../types/claim';
import { apiClient } from './api';

export const studentService = {
  /**
   * 1. PERFIL DEL ALUMNO
   * Ruta backend: GET /api/v1/alumno/profile
   */
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<any>(ENDPOINTS.ALUMNO.PROFILE);
    const profile = response?.data?.data || response?.data || response;
    return profile as StudentProfile;
  },

  /**
   * 2. MATERIAS Y ASISTENCIAS (SubjectController)
   */

  /**
   * Obtiene la lista de materias del alumno
   * Ruta backend: GET /api/v1/alumno/subjects
   */
  async getSubjects(): Promise<SubjectItem[]> {
    const response = await apiClient.get<any>(ENDPOINTS.ALUMNO.SUBJECTS);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * Obtiene el detalle de una materia con resúmenes de asistencia
   * Ruta backend: GET /api/v1/alumno/subjects/{subject}
   */
  async getSubjectDetail(subjectId: number): Promise<SubjectDetail> {
    const endpoint = `${ENDPOINTS.ALUMNO.SUBJECTS}/${subjectId}`;
    const response = await apiClient.get<any>(endpoint);
    const detail = response?.data?.data || response?.data || response;
    return detail as SubjectDetail;
  },

  /**
   * Obtiene el historial de asistencias de una materia
   * Ruta backend: GET /api/v1/alumno/subjects/{subject}/attendance
   */
  async getSubjectAttendance(subjectId: number): Promise<AttendanceRecord[]> {
    const endpoint = `${ENDPOINTS.ALUMNO.SUBJECTS}/${subjectId}/attendance`;
    const response = await apiClient.get<any>(endpoint);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * 3. JUSTIFICANTES (JustificationController)
   */

  /**
   * Solicita un justificante para una falta
   * Ruta backend: POST /api/v1/alumno/subjects/{subject}/attendance/{attendance}/justify
   */
  async submitJustification(
    subjectId: number,
    attendanceId: number,
    reason: string,
    fileUri?: string,
    fileName?: string,
    fileType?: string
  ): Promise<JustificationItem> {
    const endpoint = `${ENDPOINTS.ALUMNO.SUBJECTS}/${subjectId}/attendance/${attendanceId}/justify`;

    if (fileUri) {
      const formData = new FormData();
      formData.append('reason', reason);
      formData.append('file', {
        uri: fileUri,
        name: fileName || 'evidencia.jpg',
        type: fileType || 'image/jpeg',
      } as any);

      const response = await apiClient.postFormData<any>(endpoint, formData);
      return (response?.data?.data || response?.data || response) as JustificationItem;
    } else {
      const response = await apiClient.post<any>(endpoint, { reason });
      return (response?.data?.data || response?.data || response) as JustificationItem;
    }
  },

  /**
   * Lista todos los justificantes del alumno
   * Ruta backend: GET /api/v1/alumno/justifications
   */
  async getJustifications(): Promise<JustificationItem[]> {
    const response = await apiClient.get<any>(ENDPOINTS.ALUMNO.JUSTIFICATIONS);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * Obtiene el detalle de un justificante
   * Ruta backend: GET /api/v1/alumno/justifications/{justification}
   */
  async getJustificationDetail(justificationId: number): Promise<JustificationItem> {
    const endpoint = `${ENDPOINTS.ALUMNO.JUSTIFICATIONS}/${justificationId}`;
    const response = await apiClient.get<any>(endpoint);
    return (response?.data?.data || response?.data || response) as JustificationItem;
  },

  /**
   * 4. RECLAMOS (ClaimController)
   */

  /**
   * Crea un reclamo sobre una asistencia
   * Ruta backend: POST /api/v1/alumno/claims
   */
  async submitClaim(
    subjectId: number,
    description: string,
    evidenceUri?: string,
    fileName?: string,
    fileType?: string
  ): Promise<ClaimItem> {
    const endpoint = ENDPOINTS.ALUMNO.CLAIMS;

    if (evidenceUri) {
      const formData = new FormData();
      formData.append('subject_id', String(subjectId));
      formData.append('description', description);
      formData.append('evidence', {
        uri: evidenceUri,
        name: fileName || 'evidencia_reclamo.jpg',
        type: fileType || 'image/jpeg',
      } as any);

      const response = await apiClient.postFormData<any>(endpoint, formData);
      return (response?.data?.data || response?.data || response) as ClaimItem;
    } else {
      const response = await apiClient.post<any>(endpoint, {
        subject_id: subjectId,
        description: description,
      });
      return (response?.data?.data || response?.data || response) as ClaimItem;
    }
  },

  /**
   * Lista los reclamos del alumno
   * Ruta backend: GET /api/v1/alumno/claims
   */
  async getClaims(): Promise<ClaimItem[]> {
    const response = await apiClient.get<any>(ENDPOINTS.ALUMNO.CLAIMS);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * Obtiene el detalle de un reclamo
   * Ruta backend: GET /api/v1/alumno/claims/{claim}
   */
  async getClaimDetail(claimId: number): Promise<ClaimItem> {
    const endpoint = `${ENDPOINTS.ALUMNO.CLAIMS}/${claimId}`;
    const response = await apiClient.get<any>(endpoint);
    return (response?.data?.data || response?.data || response) as ClaimItem;
  },
};
