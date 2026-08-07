export interface TeacherGroup {
  id: number;
  grade: string | number;
  section: string;
  career_name?: string;
  active_students_count: number;
}

export interface TeacherStudentItem {
  id: number;
  first_name: string;
  second_name?: string | null;
  first_surname: string;
  second_surname?: string | null;
  full_name: string;
  email: string;
  nfc_uid?: string | null;
  photo?: string | null;
}

export interface TeacherScheduleItem {
  schedule_id: number;
  subject_id: number;
  subject_name: string;
  group_id: number;
  group_name: string;
  day: string;
  start_time: string;
  end_time: string;
  classroom: string;
  session_open?: boolean;
  active_session_id?: number | null;
}

export interface ClassSession {
  id: number;
  schedule_id: number;
  date: string;
  opened_at: string;
  closed_at?: string | null;
  status: 'ABIERTA' | 'CERRADA';
  total_registered?: number;
  total_present?: number;
  total_late?: number;
  total_absent?: number;
}

export interface SessionNfcResponse {
  student_id: number;
  student_name: string;
  status: 'PRESENTE' | 'RETARDO';
  scanned_at: string;
}

export interface TeacherIncident {
  id: number;
  title: string;
  description: string;
  severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ACTIVO' | 'CERRADO';
  type: string;
  evidence_url?: string | null;
  created_at: string;
  students_count?: number;
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  type: string;
  group_ids?: number[];
  evidence_uri?: string;
}

export interface TeacherClaim {
  id: number;
  student_name: string;
  subject_name: string;
  group_name: string;
  description: string;
  status: 'PENDIENTE' | 'EN_REVISION' | 'RESUELTO' | 'RECHAZADO';
  evidence_url?: string | null;
  created_at: string;
}
