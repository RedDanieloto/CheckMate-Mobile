export interface ClaimSubject {
  id: number;
  name: string;
}

export interface ClaimTeacher {
  id: number;
  full_name: string;
}

export interface ClaimItem {
  id: number;
  subject: ClaimSubject;
  teacher: ClaimTeacher;
  description: string;
  evidence_url?: string | null;
  status: 'PENDIENTE' | 'EN_REVISION' | 'RESUELTO' | 'RECHAZADO';
  created_at: string;
}
