"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen, Plus, Trash2, Search, Layers, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { Course, AcademicDepartment } from "@/types";

const courseSchema = z.object({
  code: z.string().min(3, "Course code must be at least 3 characters").max(10),
  title: z.string().min(3, "Title must be at least 3 characters"),
  credits: z.coerce.number().min(1, "Credits must be 1 to 6").max(6),
  departmentId: z.string().min(1, "Department selection is required"),
  description: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const res = await api.get<Course[]>("/courses?limit=100");
      return res.data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["admin", "departments"],
    queryFn: async () => {
      const res = await api.get<AcademicDepartment[]>("/departments");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: CourseFormData) => {
      const res = await api.post<Course>("/courses", formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success("Course added to university catalog!");
      setIsModalOpen(false);
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create course");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      toast.success("Course deleted successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete course");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      title: "",
      credits: 3,
      departmentId: "",
      description: "",
    },
  });

  const filtered = (courses || []).filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Courses & Curricula"
        subtitle="Manage official courses, credit weights, and prerequisite dependencies."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add New Course
          </Button>
        }
      />

      <div className="px-6 space-y-6">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <Badge variant="outline" className="text-xs">
            {filtered.length} Courses Listed
          </Badge>
        </div>

        {/* Modal for Adding Course */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full shadow-2xl border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Add Course to Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Course Code"
                      id="code"
                      placeholder="e.g. CSE201"
                      error={errors.code?.message}
                      {...register("code")}
                    />
                    <Input
                      label="Credits"
                      id="credits"
                      type="number"
                      placeholder="3"
                      error={errors.credits?.message}
                      {...register("credits")}
                    />
                  </div>

                  <Input
                    label="Course Title"
                    id="title"
                    placeholder="e.g. Database Systems"
                    error={errors.title?.message}
                    {...register("title")}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Academic Department
                    </label>
                    <select
                      className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      {...register("departmentId")}
                    >
                      <option value="">Select Department</option>
                      {(departments || []).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} - {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.departmentId && (
                      <p className="text-xs text-rose-500">{errors.departmentId.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      placeholder="Course overview and syllabus highlights..."
                      {...register("description")}
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" isLoading={createMutation.isPending}>
                      Save Course
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Courses Grid */}
        {isCoursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Courses Found"
            description="No course matches your query. Add a new course to the catalog."
            actionLabel="Add Course"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Card key={course.id} className="border-slate-200/80 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50">
                      {course.code}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-xs">
                        {course.credits} Credits
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-rose-600"
                        onClick={() => {
                          if (confirm(`Delete course ${course.code}?`)) {
                            deleteMutation.mutate(course.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-slate-500">
                  <p className="line-clamp-2">
                    {course.description || "Foundational degree curriculum module."}
                  </p>
                  <div className="pt-2 border-t flex items-center justify-between text-[11px] text-slate-400">
                    <span>Dept: {course.department?.code || "Assigned"}</span>
                    <span className="font-mono">{course.id.slice(0, 8)}...</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
