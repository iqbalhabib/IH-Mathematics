export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: "O Level" | "A Level";
  video_url: string;
  price: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  status: "active" | "completed";
}

export interface PastPaper {
  id: string;
  title: string;
  level: "O Level" | "A Level";
  year: number;
  subject: string;
  file_url: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  present: boolean;
}
