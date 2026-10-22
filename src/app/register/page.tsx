"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraduationCap, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { UNIVERSITY_NAME } from "@/lib/constants";
import { AcademicDepartment } from "@/types";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  departmentCode: z.string().min(2, "Department selection is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const departmentsQuery = useQuery({
    queryKey: ["public", "departments"],
    queryFn: async () => (await api.get<AcademicDepartment[]>("/departments")).data,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      departmentCode: "",
    },
  });
  const departmentCode = useWatch({ control, name: "departmentCode" });

  useEffect(() => {
    const firstDepartmentCode = departmentsQuery.data?.[0]?.code;
    if (firstDepartmentCode && !departmentCode) {
      setValue("departmentCode", firstDepartmentCode, { shouldValidate: true });
    }
  }, [departmentsQuery.data, departmentCode, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        departmentCode: data.departmentCode,
      });

      toast.success("Account registered successfully! Please log in.");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {UNIVERSITY_NAME}
          </span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Apply & Register as a Student
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Already have an enrolled account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign In Here
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card className="shadow-lg border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-lg">Online Student Enrollment Form</CardTitle>
            <CardDescription>
              Create a student demo account in the University Management System.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  id="firstName"
                  placeholder="e.g. John"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  placeholder="e.g. Doe"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <Input
                label="Academic Email"
                id="email"
                type="email"
                placeholder="e.g. john.doe@student.university.edu"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Choose Password"
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="w-full space-y-1.5">
                <label
                  htmlFor="departmentCode"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Intended Academic Department
                </label>
                <select
                  id="departmentCode"
                  disabled={departmentsQuery.isLoading || departmentsQuery.isError || !departmentsQuery.data?.length}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register("departmentCode")}
                >
                  <option value="">{departmentsQuery.isLoading ? "Loading departments..." : "Select a department"}</option>
                  {(departmentsQuery.data || []).map((department) => (
                    <option key={department.id} value={department.code}>{department.code} - {department.name}</option>
                  ))}
                </select>
                {departmentsQuery.isError ? (
                  <div className="flex items-center gap-2 text-xs text-rose-600" role="alert">
                    <span>Departments could not be loaded.</span>
                    <Button type="button" variant="link" size="sm" onClick={() => void departmentsQuery.refetch()} className="h-auto px-1 py-0 text-rose-700">Try again</Button>
                  </div>
                ) : departmentsQuery.data?.length === 0 ? (
                  <p className="text-xs text-slate-500">No departments are open for registration right now.</p>
                ) : null}
                {errors.departmentCode && (
                  <p className="text-xs font-medium text-rose-500 mt-1">
                    {errors.departmentCode.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full gap-2 mt-4" isLoading={isSubmitting} disabled={departmentsQuery.isLoading || departmentsQuery.isError || !departmentsQuery.data?.length}>
                Submit Application & Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-center text-xs text-slate-500 border-t py-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle className="h-4 w-4" />
              Instant Student ID generation on confirmation
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
