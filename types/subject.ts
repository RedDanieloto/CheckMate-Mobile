export interface SubjectTeacher {
  id: number;
  full_name: string;
  photo?: string;
}

export interface SubjectItem {
  id: number;
  name: string;
  teacher: SubjectTeacher;
  schedule: string;
}

export interface AttendanceSummary {
  on_time: number;
  late: number;
  absent: number;
}

export interface SubjectDetail {
  id: number;
  name: string;
  teacher: SubjectTeacher;
  classroom: string;
  schedule: string;
  attendance_summary: AttendanceSummary;
}

export interface AttendanceRecord {
  attendance_id: number;
  date: string;
  status: 'PRESENTE' | 'RETARDO' | 'FALTA';
  justifiable: boolean;
}
