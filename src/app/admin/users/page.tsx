"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, Shield, Trash2, CheckCircle2, UserCheck, ShieldAlert, Filter } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { formatDate, getStatusBadgeClasses } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { User, Role, UserStatus } from "@/types";

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const initialSearch = searchParams.get("q") || "";
  const initialRole = searchParams.get("role") || "ALL";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);

  // Synchronize URL parameters with user search & role filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    if (selectedRole && selectedRole !== "ALL") params.set("role", selectedRole);

    const query = params.toString();
    const targetUrl = query ? `/admin/users?${query}` : `/admin/users`;
    router.replace(targetUrl, { scroll: false });
  }, [debouncedSearchTerm, selectedRole, router]);

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
      u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      u.profile?.firstName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      u.profile?.lastName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="User Governance & Directory"
        subtitle="Manage administrative credentials, faculty assignments, and student access accounts with live URL state synchronization."
      />

      <div className="px-6 space-y-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email (syncs to URL)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              {["ALL", "ADMIN", "FACULTY", "STUDENT"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedRole === r
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            {filtered.length} Users Listed
          </Badge>
        </div>

        {/* Users Table */}
        <Card className="border-slate-200/80 overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold">Authenticated Accounts Ledger</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No Users Found"
                description="No user accounts match your filter criteria or search query."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-6">User Account</th>
                      <th className="py-3 px-6">Assigned Role</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Created Date</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                              {u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {u.profile?.firstName
                                  ? `${u.profile.firstName} ${u.profile.lastName}`
                                  : "User"}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateRoleStatusMutation.mutate({
                                id: u.id,
                                role: e.target.value as Role,
                              })
                            }
                            className="text-xs bg-transparent border border-slate-200 rounded px-2 py-1 font-semibold dark:border-slate-800"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="FACULTY">FACULTY</option>
                            <option value="STUDENT">STUDENT</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(
                              u.status
                            )}`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-500">{formatDate(u.createdAt)}</td>
                        <td className="py-3.5 px-6 text-right space-x-2">
                          {u.status === "ACTIVE" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] h-7 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                              onClick={() =>
                                updateRoleStatusMutation.mutate({ id: u.id, status: "BLOCKED" })
                              }
                            >
                              Block Access
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

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <AdminUsersContent />
    </Suspense>
  );
}
