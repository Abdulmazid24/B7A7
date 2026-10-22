"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationModal, Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryErrorState } from "@/components/shared/query-error-state";
import { api } from "@/lib/api-client";
import { AcademicDepartment } from "@/types";
import { useUrlSearchParam } from "@/lib/use-url-search-param";

const departmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(6, "Code max 6 characters"),
  description: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function AdminDepartmentsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useUrlSearchParam("q");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<AcademicDepartment | null>(null);

  const { data: departments, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "departments"],
    queryFn: async () => {
      const res = await api.get<AcademicDepartment[]>("/departments");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: DepartmentFormData) => {
      const res = await api.post<AcademicDepartment>("/departments", formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "departments"] });
      toast.success("Department created successfully!");
      setIsModalOpen(false);
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create department");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "departments"] });
      toast.success("Department deleted successfully!");
      setDepartmentToDelete(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete department");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const filtered = (departments || []).filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Academic Departments"
        subtitle="Create and manage departments in the academic catalog."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add New Department
          </Button>
        }
      />

      <ConfirmationModal
        isOpen={Boolean(departmentToDelete)}
        onClose={() => setDepartmentToDelete(null)}
        onConfirm={() => { if (departmentToDelete) deleteMutation.mutate(departmentToDelete.id); }}
        title="Delete department?"
        description={`Delete ${departmentToDelete?.name ?? "this department"} from the academic catalog? Related records may prevent deletion.`}
        confirmLabel="Delete department"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      <div className="px-6 space-y-6">
        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              aria-label="Search departments by name or code"
              placeholder="Search departments by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <Badge variant="outline" className="text-xs">
            {filtered.length} Departments Found
          </Badge>
        </div>

        {/* Modal for Creating Department */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Academic Department"
          description="Enter the department name and unique code."
        >
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <Input
              label="Department Name"
              id="name"
              placeholder="e.g. Mechanical Engineering"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Department Code"
              id="code"
              placeholder="e.g. ME"
              error={errors.code?.message}
              {...register("code")}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Academic division scope and specializations..."
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
                Save Department
              </Button>
            </div>
          </form>
        </Modal>

        {/* Departments Table / Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <QueryErrorState title="Departments could not be loaded" onRetry={() => void refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Departments Found"
            description="No academic departments match your query. Add a new department to populate the catalog."
            actionLabel="Add Department"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((dept) => (
              <Card key={dept.id} className="border-slate-200/80 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono font-bold text-xs">
                      {dept.code}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete department ${dept.name}`}
                      className="h-8 w-8 text-slate-400 hover:text-rose-600"
                      onClick={() => setDepartmentToDelete(dept)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base mt-2">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-500">
                  <p className="line-clamp-2">
                    {dept.description || "Department record in the academic catalog."}
                  </p>
                  <div className="pt-3 border-t flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span>ID: {dept.id.slice(0, 8)}...</span>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                      Active
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
