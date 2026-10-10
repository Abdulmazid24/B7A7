"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarDays, Plus, CheckCircle, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { AcademicSemester } from "@/types";

const semesterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  year: z.coerce.number().min(2024).max(2035),
  code: z.string().min(2, "Code must be at least 2 characters"),
  startDate: z.string().min(4, "Start date required"),
  endDate: z.string().min(4, "End date required"),
});

type SemesterFormData = z.infer<typeof semesterSchema>;

export default function AdminSemestersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: semesters, isLoading } = useQuery({
    queryKey: ["admin", "semesters"],
    queryFn: async () => {
      const res = await api.get<AcademicSemester[]>("/semesters");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: SemesterFormData) => {
      const res = await api.post<AcademicSemester>("/semesters", {
        ...formData,
        isCurrent: false,
        isRegistrationOpen: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "semesters"] });
      toast.success("Semester added to academic calendar!");
      setIsModalOpen(false);
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create semester");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: "Fall 2026",
      year: 2026,
      code: "FL26",
      startDate: "2026-09-01",
      endDate: "2026-12-30",
    },
  });

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Academic Semesters"
        subtitle="Schedule academic terms, active enrollment windows, and semester calendars."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Create Semester
          </Button>
        }
      />

      <div className="px-6 space-y-6">
        {/* Modal for Creating Semester */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
            <Card className="max-w-md w-full shadow-2xl border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Create Academic Semester</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Semester Name"
                      id="name"
                      placeholder="e.g. Fall 2026"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Year"
                      id="year"
                      type="number"
                      placeholder="2026"
                      error={errors.year?.message}
                      {...register("year")}
                    />
                  </div>

                  <Input
                    label="Semester Code"
                    id="code"
                    placeholder="e.g. FL26"
                    error={errors.code?.message}
                    {...register("code")}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Start Date"
                      id="startDate"
                      type="date"
                      error={errors.startDate?.message}
                      {...register("startDate")}
                    />
                    <Input
                      label="End Date"
                      id="endDate"
                      type="date"
                      error={errors.endDate?.message}
                      {...register("endDate")}
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
                      Save Semester
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Semesters Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (semesters || []).length === 0 ? (
          <EmptyState
            title="No Semesters Configured"
            description="Create an academic term to begin offering course sections."
            actionLabel="Create Semester"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(semesters || []).map((sem) => (
              <Card key={sem.id} className="border-slate-200/80">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      {sem.code}
                    </Badge>
                    {sem.isCurrent ? (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Current Active Term
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Scheduled Term
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-2">{sem.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>
                      {formatDate(sem.startDate)} — {formatDate(sem.endDate)}
                    </span>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span>Registration Status:</span>
                    <Badge variant={sem.isRegistrationOpen ? "success" : "secondary"} className="text-[10px]">
                      {sem.isRegistrationOpen ? "Open for Students" : "Closed"}
                    </Badge>
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
