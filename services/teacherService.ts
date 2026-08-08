import { ENDPOINTS } from '../config/env';
import {
  TeacherGroup,
  TeacherStudentItem,
  TeacherScheduleItem,
  ClassSession,
  SessionNfcResponse,
  TeacherIncident,
  CreateIncidentPayload,
  TeacherClaim,
} from '../types/teacher';
import { AttendanceRecord } from '../types/subject';
import { JustificationItem } from '../types/justification';
import { apiClient } from './api';

export const teacherService = {
  /**
   * 1. GRUPOS DE CLASES (GroupController)
   */

  /**
   * GET /api/v1/profesor/groups
   */
  async getGroups(): Promise<TeacherGroup[]> {
    const response = await apiClient.get<any>(ENDPOINTS.PROFESOR.GROUPS);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * GET /api/v1/profesor/groups/{group}/students
   */
  async getGroupStudents(groupId: number): Promise<TeacherStudentItem[]> {
    const endpoint = `${ENDPOINTS.PROFESOR.GROUPS}/${groupId}/students`;
    const response = await apiClient.get<any>(endpoint);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * 2. CONSULTA DE ALUMNOS (StudentController)
   */

  /**
   * GET /api/v1/profesor/students/{student}
   */
  async getStudentDetail(studentId: number): Promise<TeacherStudentItem> {
    const endpoint = `${ENDPOINTS.PROFESOR.STUDENTS}/${studentId}`;
    const response = await apiClient.get<any>(endpoint);
    return (response?.data?.data || response?.data || response) as TeacherStudentItem;
  },

  /**
   * GET /api/v1/profesor/students/{student}/attendance
   */
  async getStudentAttendance(
    studentId: number,
    filters?: { subject_id?: number; start_date?: string; end_date?: string }
  ): Promise<AttendanceRecord[]> {
    const endpoint = `${ENDPOINTS.PROFESOR.STUDENTS}/${studentId}/attendance`;
    const response = await apiClient.get<any>(endpoint, { params: filters as any });
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * GET /api/v1/profesor/students/{student}/justifications
   */
  async getStudentJustifications(studentId: number): Promise<JustificationItem[]> {
    const endpoint = `${ENDPOINTS.PROFESOR.STUDENTS}/${studentId}/justifications`;
    const response = await apiClient.get<any>(endpoint);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * 3. HORARIOS (ScheduleController)
   */

  /**
   * GET /api/v1/profesor/schedule/today
   */
  async getTodaySchedule(): Promise<TeacherScheduleItem[]> {
    const response = await apiClient.get<any>(ENDPOINTS.PROFESOR.SCHEDULE_TODAY);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * GET /api/v1/profesor/schedule (?day=LUNES)
   */
  async getWeekSchedule(day?: string): Promise<TeacherScheduleItem[]> {
    const params = day ? { day } : undefined;
    const response = await apiClient.get<any>(ENDPOINTS.PROFESOR.SCHEDULE, { params });
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * 4. SESIONES Y PASE DE LISTA (SessionController)
   */

  /**
   * POST /api/v1/profesor/sessions/open
   */
  async openSession(scheduleId: number, date?: string): Promise<ClassSession> {
    const payload = {
      schedule_id: scheduleId,
      date: date || new Date().toISOString().split('T')[0],
    };
    const endpoint = `${ENDPOINTS.PROFESOR.SESSIONS}/open`;
    const response = await apiClient.post<any>(endpoint, payload);
    return (response?.data?.data || response?.data || response) as ClassSession;
  },

  /**
   * POST /api/v1/profesor/sessions/{session}/nfc
   */
  async scanNfcAttendance(sessionId: number, nfcUid: string): Promise<SessionNfcResponse> {
    const endpoint = `${ENDPOINTS.PROFESOR.SESSIONS}/${sessionId}/nfc`;
    const response = await apiClient.post<any>(endpoint, { nfc_uid: nfcUid });
    return (response?.data?.data || response?.data || response) as SessionNfcResponse;
  },

  /**
   * PATCH /api/v1/profesor/sessions/{session}/students/{student}
   */
  async updateStudentAttendance(
    sessionId: number,
    studentId: number,
    status: 'PRESENTE' | 'RETARDO' | 'FALTA'
  ): Promise<any> {
    const endpoint = `${ENDPOINTS.PROFESOR.SESSIONS}/${sessionId}/students/${studentId}`;
    const response = await apiClient.put<any>(endpoint, { status });
    return response?.data?.data || response?.data || response;
  },

  /**
   * POST /api/v1/profesor/sessions/{session}/close
   */
  async closeSession(sessionId: number): Promise<ClassSession> {
    const endpoint = `${ENDPOINTS.PROFESOR.SESSIONS}/${sessionId}/close`;
    const response = await apiClient.post<any>(endpoint);
    return (response?.data?.data || response?.data || response) as ClassSession;
  },

  /**
   * 5. INCIDENTES Y EMERGENCIA (IncidentController)
   */

  /**
   * GET /api/v1/profesor/incidents/active
   */
  async getActiveIncidents(): Promise<TeacherIncident[]> {
    const endpoint = `${ENDPOINTS.PROFESOR.INCIDENTS}/active`;
    const response = await apiClient.get<any>(endpoint);
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * GET /api/v1/profesor/incidents
   */
  async getIncidents(filters?: { type?: string; start_date?: string; end_date?: string }): Promise<TeacherIncident[]> {
    const response = await apiClient.get<any>(ENDPOINTS.PROFESOR.INCIDENTS, { params: filters as any });
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * GET /api/v1/profesor/incidents/{incident}
   */
  async getIncidentDetail(incidentId: number): Promise<TeacherIncident> {
    const endpoint = `${ENDPOINTS.PROFESOR.INCIDENTS}/${incidentId}`;
    const response = await apiClient.get<any>(endpoint);
    return (response?.data?.data || response?.data || response) as TeacherIncident;
  },

  /**
   * POST /api/v1/profesor/incidents
   */
  async createIncident(payload: CreateIncidentPayload): Promise<TeacherIncident> {
    const endpoint = ENDPOINTS.PROFESOR.INCIDENTS;

    if (payload.evidence_uri) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('severity', payload.severity);
      formData.append('type', payload.type);
      if (payload.group_ids) {
        formData.append('group_ids', JSON.stringify(payload.group_ids));
      }
      formData.append('evidence', {
        uri: payload.evidence_uri,
        name: 'incidente_evidencia.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await apiClient.postFormData<any>(endpoint, formData);
      return (response?.data?.data || response?.data || response) as TeacherIncident;
    } else {
      const response = await apiClient.post<any>(endpoint, payload);
      return (response?.data?.data || response?.data || response) as TeacherIncident;
    }
  },

  /**
   * PUT /api/v1/profesor/incidents/{incident}
   */
  async updateIncident(incidentId: number, payload: Partial<CreateIncidentPayload>): Promise<TeacherIncident> {
    const endpoint = `${ENDPOINTS.PROFESOR.INCIDENTS}/${incidentId}`;
    const response = await apiClient.put<any>(endpoint, payload);
    return (response?.data?.data || response?.data || response) as TeacherIncident;
  },

  /**
   * PATCH /api/v1/profesor/incidents/{incident}/students
   */
  async updateIncidentStudents(incidentId: number, studentStatuses: { student_id: number; present?: boolean; status?: string }[]): Promise<any> {
    const endpoint = `${ENDPOINTS.PROFESOR.INCIDENTS}/${incidentId}/students`;
    const response = await apiClient.post<any>(endpoint, { students: studentStatuses });
    return response?.data?.data || response?.data || response;
  },

  /**
   * 6. RECLAMOS DE ASISTENCIA (ClaimController)
   */

  /**
   * GET /api/v1/profesor/claims
   */
  async getClaims(filters?: { status?: string; group_id?: number }): Promise<TeacherClaim[]> {
    const response = await apiClient.get<any>(ENDPOINTS.PROFESOR.CLAIMS, { params: filters as any });
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list) ? list : [];
  },

  /**
   * GET /api/v1/profesor/claims/{claim}
   */
  async getClaimDetail(claimId: number): Promise<TeacherClaim> {
    const endpoint = `${ENDPOINTS.PROFESOR.CLAIMS}/${claimId}`;
    const response = await apiClient.get<any>(endpoint);
    return (response?.data?.data || response?.data || response) as TeacherClaim;
  },
};
