export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string;
  imageUrl?: string;
  academy: string;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  academy?: string;
  student_id?: string;
}

export interface UpdateTeacherRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  academy?: string;
}
