export type Role = "ADMIN" | "FACULTY" | "STUDENT";

export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  studentId?: string | null;
  facultyId?: string | null;
  profile?: UserProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  departmentId?: string | null;
  department?: AcademicDepartment | null;
  address?: string | null;
  bio?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AcademicDepartment {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    courses?: number;
    faculties?: number;
    students?: number;
  };
}

export interface AcademicSemester {
  id: string;
  name: string;
  year: number;
  code: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isRegistrationOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  departmentId: string;
  department?: AcademicDepartment;
  description?: string | null;
  prerequisites?: {
    id: string;
    courseId: string;
    prerequisiteId: string;
    prerequisite: {
      id: string;
      code: string;
      title: string;
      credits: number;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseOffering {
  id: string;
  semesterId: string;
  semester?: AcademicSemester;
  courseId: string;
  course?: Course;
  sections?: CourseSection[];
  sectionNumber?: number | string;
  capacity?: number;
  enrolledCount?: number;
  scheduleTime?: string;
  roomNumber?: string;
  facultyId?: string | null;
  faculty?: {
    id?: string;
    email?: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseSection {
  id: string;
  offeringId: string;
  sectionNumber: string | number;
  capacity: number;
  enrolledCount: number;
  schedule: string;
  room?: string | null;
  facultyId?: string | null;
  faculty?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  } | null;
  offering?: {
    course: Course;
    semester: AcademicSemester;
  };
}

export interface Enrollment {
  id: string;
  studentId?: string;
  sectionId?: string;
  section?: CourseSection;
  courseOfferingId?: string;
  courseOffering?: CourseOffering;
  status?: "ENROLLED" | "COMPLETED" | "DROPPED" | "WITHDRAWN" | string;
  enrolledAt?: string;
  droppedAt?: string | null;
}

export interface StudentGrade {
  id: string;
  enrollmentId: string;
  enrollment: Enrollment;
  studentId: string;
  student: {
    id: string;
    email: string;
    studentId?: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  sectionId: string;
  classTestMarks?: number | null;
  midtermMarks?: number | null;
  finalMarks?: number | null;
  totalMarks?: number | null;
  letterGrade?: string | null;
  gradePoint?: number | null;
  isPublished: boolean;
}

export interface TranscriptRecord {
  semesterId: string;
  semesterName: string;
  courses: {
    courseCode: string;
    courseTitle: string;
    credits: number;
    letterGrade: string;
    gradePoint: number;
  }[];
  semesterGpa: number;
  semesterCredits: number;
}

export interface AcademicTranscript {
  student: {
    id: string;
    name: string;
    studentId: string;
    department: string;
  };
  semesters: TranscriptRecord[];
  cgpa: number;
  totalEarnedCredits: number;
}

export interface TuitionFee {
  id: string;
  studentId: string;
  semesterId: string;
  semester: AcademicSemester;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
  dueDate: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  student: {
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  tuitionFeeId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  stripeSessionId?: string | null;
  transactionId?: string | null;
  receiptUrl?: string | null;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalFaculties: number;
  totalDepartments: number;
  totalCourses: number;
  totalEnrollments: number;
  revenue: {
    totalAssessed: number;
    totalCollected: number;
    totalOutstanding: number;
  };
  departmentDistribution: {
    name: string;
    students: number;
    courses: number;
  }[];
  recentEnrollments: {
    id: string;
    studentName: string;
    courseTitle: string;
    enrolledAt: string;
  }[];
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: ApiMeta;
  data: T;
  errors?: { path: string; message: string }[];
}
