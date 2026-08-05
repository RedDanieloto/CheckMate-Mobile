export interface StudentGroup {
  id: number;
  grade: number;
  section: string;
}

export interface StudentCareer {
  id: number;
  name: string;
}

export interface StudentProfile {
  id: number;
  first_name: string;
  second_name?: string | null;
  first_surname: string;
  second_surname?: string | null;
  email: string;
  phone?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  photo?: string | null;
  group?: StudentGroup | null;
  career?: StudentCareer | null;
}
