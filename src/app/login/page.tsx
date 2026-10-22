"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraduationCap, Shield, Award, Sparkles, ArrowRight, BookOpen } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { UNIVERSITY_NAME } from "@/lib/constants";
import { soundManager } from "@/lib/audio";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid academic email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

  const { loginWithCredentials, loginWithDemoRole, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await loginWithCredentials(data.email, data.password);
      soundManager.playSuccessChime();
      toast.success(`Welcome back, ${user.profile?.firstName || user.email}!`);

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "FACULTY") {
        router.push("/faculty");
      } else {
        router.push("/student");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      toast.error(message);
    }
  };

  const handleDemoLogin = async (role: "admin" | "faculty" | "student") => {
    setActiveDemoRole(role);
    try {
      await loginWithDemoRole(role);
      soundManager.playSuccessChime();
      toast.success(`Logged in successfully as Demo ${role.toUpperCase()}!`);

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (role === "admin") {
        router.push("/admin");
      } else if (role === "faculty") {
        router.push("/faculty");
      } else {
        router.push("/student");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Demo sign in failed";
      toast.error(message);
    } finally {
      setActiveDemoRole(null);
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
          Sign in to your academic account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Or apply as a new student via{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Online Registration
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* ONE-CLICK DEMO LOGIN SECTION (MANDATORY REQUIREMENT) */}
        <div className="mb-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                🚀 One-Click Role Demo Login (Evaluation Ready)
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] bg-white border-indigo-200 text-indigo-700">
              Evaluator Mode
            </Badge>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Choose a role to open its demo workspace. Demo access depends on the configured backend accounts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Admin Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("admin")}
              isLoading={activeDemoRole === "admin"}
              className="flex-col h-auto py-3 px-3 border-purple-200 bg-white hover:bg-purple-50 text-purple-950 dark:bg-slate-900 dark:border-purple-900/50 dark:hover:bg-purple-950/40"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-300">
                <Shield className="h-3.5 w-3.5" />
                ADMIN PORTAL
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">System Administrator</span>
            </Button>

            {/* Faculty Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("faculty")}
              isLoading={activeDemoRole === "faculty"}
              className="flex-col h-auto py-3 px-3 border-blue-200 bg-white hover:bg-blue-50 text-blue-950 dark:bg-slate-900 dark:border-blue-900/50 dark:hover:bg-blue-950/40"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-300">
                <Award className="h-3.5 w-3.5" />
                FACULTY PORTAL
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Teacher & Grader</span>
            </Button>

            {/* Student Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("student")}
              isLoading={activeDemoRole === "student"}
              className="flex-col h-auto py-3 px-3 border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-950 dark:bg-slate-900 dark:border-emerald-900/50 dark:hover:bg-emerald-950/40"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-300">
                <BookOpen className="h-3.5 w-3.5" />
                STUDENT PORTAL
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Enrollment & Stripe</span>
            </Button>
          </div>
        </div>

        {/* Regular Login Card */}
        <Card className="shadow-lg border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-lg">Standard Sign In</CardTitle>
            <CardDescription>
              Enter your official academic email address and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  label="Academic Email"
                  id="email"
                  type="email"
                  placeholder="e.g. admin@university.edu"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div>
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>

              <Button type="submit" className="w-full gap-2 mt-2" isLoading={isLoading && !activeDemoRole}>
                Sign In to Portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-slate-500 pt-4 border-t">
            <span>Student Admission Assistance</span>
            <Link href="/contact" className="hover:text-indigo-600 font-medium">
              Contact Registrar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8 text-sm text-slate-500">Loading sign in portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

