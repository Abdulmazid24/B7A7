"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, Shield, Trash2, CheckCircle2, UserCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { formatDate, getStatusBadgeClasses } from "@/lib/utils";
import { User, Role, UserStatus } from "@/types";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await api.get<User[]>("/users?limit=50");
      return res.data;
    },
  });

  const updateRoleStatusMutation = useMutation({
    mutationFn: async ({ id, role, status }: { id: string; role?: Role; status?: UserStatus }) => {
      await api.patch(`/users/${id}/role-status`, { role, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role / status updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User account soft-deleted!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete user");
    },
  });

  const filtered = (users || []).filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="User Governance & Directory"
        subtitle="Manage campus user accounts, assign roles (Admin, Faculty, Student), and enforce status restrictions."
      />

      <div className="px-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            {["ALL", "ADMIN", "FACULTY", "STUDENT"].map((r) => (
              <Button
                key={r}
                variant={selectedRole === r ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(r)}
                className="text-xs"
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-slate-200/80 overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">University Accounts Directory</CardTitle>
              <Badge variant="outline" className="text-xs">
                {filtered.length} Users Found
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState title="No Users Found" description="Try adjusting your role filter or search keyword." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-6">User / Name</th>
                      <th className="py-3 px-6">Role</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Department</th>
                      <th className="py-3 px-6">Created Date</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-6">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {u.profile?.firstName
                                ? `${u.profile.firstName} ${u.profile.lastName}`
                                : u.email.split("@")[0]}
                            </span>
                            <span className="text-[11px] text-slate-500">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <Badge
                            variant="secondary"
                            className={`font-semibold text-[10px] ${
                              u.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : u.role === "FACULTY"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(
                              u.status
                            )}`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-500">
                          {u.profile?.department?.code || "Central"}
                        </td>
                        <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="py-3.5 px-6 text-right space-x-1">
                          {u.status === "ACTIVE" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] h-7 px-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                              onClick={() =>
                                updateRoleStatusMutation.mutate({ id: u.id, status: "BLOCKED" })
                              }
                            >
                              Block
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] h-7 px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              onClick={() =>
                                updateRoleStatusMutation.mutate({ id: u.id, status: "ACTIVE" })
                              }
                            >
                              Activate
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-rose-600"
                            onClick={() => {
                              if (confirm(`Soft-delete user ${u.email}?`)) {
                                deleteMutation.mutate(u.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
