export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://b7-a6-kohl.vercel.app/api/v1";

export const UNIVERSITY_NAME =
  process.env.NEXT_PUBLIC_UNIVERSITY_NAME || "Metropolitan University";

export const DEMO_CREDENTIALS = {
  admin: {
    email: "admin@university.edu",
    password: "AdminPassword123!",
    role: "ADMIN" as const,
    label: "Admin Portal",
    description: "Manage departments, courses, offerings, users, and audit analytics.",
  },
  faculty: {
    email: "faculty@university.edu",
    password: "FacultyPassword123!",
    role: "FACULTY" as const,
    label: "Faculty Portal",
    description: "View assigned sections, student rosters, and publish academic marks.",
  },
  student: {
    email: "student@university.edu",
    password: "StudentPassword123!",
    role: "STUDENT" as const,
    label: "Student Portal",
    description: "Enroll in courses, view official transcript CGPA, and pay tuition via Stripe.",
  },
};

export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Tuition & Fees", href: "/tuition" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Departments", href: "/admin/departments", icon: "Building2" },
  { label: "Semesters", href: "/admin/semesters", icon: "CalendarDays" },
  { label: "Courses", href: "/admin/courses", icon: "BookOpen" },
  { label: "Offerings & Sections", href: "/admin/offerings", icon: "Layers" },
  { label: "Users & Roles", href: "/admin/users", icon: "Users" },
  { label: "Payments & Ledger", href: "/admin/payments", icon: "Receipt" },
];

export const FACULTY_NAV_LINKS = [
  { label: "Overview", href: "/faculty", icon: "LayoutDashboard" },
  { label: "My Sections & Rosters", href: "/faculty/sections", icon: "GraduationCap" },
  { label: "Submit Marks & Grades", href: "/faculty/grading", icon: "Award" },
];

export const STUDENT_NAV_LINKS = [
  { label: "My Overview", href: "/student", icon: "LayoutDashboard" },
  { label: "Course Registration", href: "/student/registration", icon: "PlusCircle" },
  { label: "Academic Transcript", href: "/student/transcript", icon: "FileText" },
  { label: "Tuition & Stripe Pay", href: "/student/invoices", icon: "CreditCard" },
];
