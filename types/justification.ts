export interface JustificationSubject {
  id: number;
  name: string;
}

export interface JustificationReviewer {
  id: number;
  full_name: string;
}

export interface JustificationItem {
  id: number;
  subject: JustificationSubject;
  date: string;
  reason: string;
  evidence_url?: string | null;
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  reviewed_by?: JustificationReviewer | null;
  reviewed_at?: string | null;
  comment?: string | null;
  created_at: string;
}
