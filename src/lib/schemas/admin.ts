import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name must have at least 2 characters"),
  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code cannot exceed 10 characters")
    .toUpperCase(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

export const courseSchema = z.object({
  code: z
    .string()
    .min(3, "Course code must be at least 3 characters")
    .max(12, "Course code cannot exceed 12 characters")
    .toUpperCase(),
  title: z.string().min(3, "Course title must be at least 3 characters"),
  credits: z.coerce
    .number()
    .min(1, "Course must be at least 1 credit")
    .max(6, "Course cannot exceed 6 credits"),
  departmentId: z.string().min(1, "Department assignment is required"),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const semesterSchema = z.object({
  name: z.string().min(3, "Semester name is required"),
  year: z.coerce.number().min(2020).max(2035),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isRegistrationOpen: z.boolean().default(false),
});

export type SemesterFormData = z.infer<typeof semesterSchema>;

export const courseOfferingSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  semesterId: z.string().min(1, "Semester is required"),
  facultyId: z.string().optional(),
  sectionNumber: z.coerce.number().min(1, "Section must be positive integer"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1 student"),
  roomNumber: z.string().min(1, "Room location is required"),
  scheduleTime: z.string().min(1, "Class schedule time is required"),
});

export type CourseOfferingFormData = z.infer<typeof courseOfferingSchema>;
