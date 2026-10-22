"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UNIVERSITY_NAME } from "@/lib/constants";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    if (!contactEmail) {
      toast.error("Contact delivery is not configured for this deployment. Your message was not sent.");
      return;
    }

    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(`Name: ${data.fullName}\nReply to: ${data.email}\n\n${data.message}`);
    window.location.assign(`mailto:${contactEmail}?subject=${subject}&body=${body}`);
    toast.info("Your email app should open with a draft. Send it there to deliver your inquiry.");
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-16 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Registrar Office & Academic Inquiries
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Contact {UNIVERSITY_NAME}
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed">
              Have questions regarding admissions, prerequisite clearances, or credit assessments? Reach out to our campus desk.
            </p>
          </div>
        </section>

        {/* Form & Info Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Info Column */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Campus Office & Locations
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Campus office hours have not been configured for this demo deployment.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 dark:bg-indigo-950/50">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Central Campus</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Campus address not configured
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 dark:bg-emerald-950/50">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Telephone Helpline</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Telephone number not configured</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 dark:bg-purple-950/50">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Contact the platform team</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{contactEmail ?? "Contact email not configured for this deployment"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Form Column */}
              <Card className="border-slate-200/80 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Send an Academic Inquiry</CardTitle>
                  <CardDescription>
                    Fields are validated before opening an email draft. Delivery requires a configured contact email.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input
                        label="Full Name"
                        id="fullName"
                        placeholder="e.g. Dr. Jane Smith"
                        error={errors.fullName?.message}
                        {...register("fullName")}
                      />

                      <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="e.g. janesmith@example.com"
                        error={errors.email?.message}
                        {...register("email")}
                      />

                      <Input
                        label="Inquiry Subject"
                        id="subject"
                        placeholder="e.g. Credit Transfer & Prerequisite Query"
                        error={errors.subject?.message}
                        {...register("subject")}
                      />

                      <div className="space-y-1.5">
                        <label
                          htmlFor="message"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                        >
                          Detailed Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="flex w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                          placeholder="Please provide details regarding your department, student ID, or question..."
                          {...register("message")}
                        />
                        {errors.message && (
                          <p className="text-xs font-medium text-rose-500 mt-1">{errors.message.message}</p>
                        )}
                      </div>

                      <Button type="submit" className="w-full gap-2 mt-2" isLoading={isSubmitting}>
                        Submit Inquiry
                        <Send className="h-4 w-4" />
                      </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
