# 🎓 University Management System (UMS) - Frontend Portal
> **Programming Hero Level-2 Batch 7 | Assignment 7 (Fullstack Milestone)**  
> **Student ID Last Digit: 9 (University Management System)**  
> **Author:** Abdul Mazid  
> **Frontend Repository:** [https://github.com/Abdulmazid24/B7A7.git](https://github.com/Abdulmazid24/B7A7.git)  
> **Backend Repository:** [https://github.com/Abdulmazid24/B7A6.git](https://github.com/Abdulmazid24/B7A6.git)  
> **Live Backend API:** [https://b7-a6-kohl.vercel.app](https://b7-a6-kohl.vercel.app)  

---

## 📌 Submission Information (Exact Format)

```text
Project Name            : University Management System (UMS)
Backend Repo            : https://github.com/Abdulmazid24/B7A6.git
Frontend Repo           : https://github.com/Abdulmazid24/B7A7.git
Live Backend URL        : https://b7-a6-kohl.vercel.app
Live Frontend URL       : https://b7-a7-ums.vercel.app (Pending Final Deployment)
API Documentation       : https://documenter.getpostman.com/view/58861661/2sBYHQ2i1P
Demo Video              : https://www.loom.com/share/placeholder
Demo Admin Email        : admin@university.edu
Demo Admin Password     : AdminPassword123!
```

---

## 🌟 Executive Overview
The **University Management System (UMS)** frontend is an enterprise-grade, high-performance web application engineered with **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query v5, Zustand, and Stripe**.

It directly integrates with our deployed **B7A6 REST Backend** (`https://b7-a6-kohl.vercel.app/api/v1`), providing seamless role-based workflows for **Administrators, Faculty members, and Students**.

---

## 🛠️ Tech Stack & Real-Time Latest Stable Versions

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.4.0 | Server & Client Components, Turbopack, App Router |
| **Language** | TypeScript | ^5.8 | Strict compile-time type safety across all models |
| **Styling** | Tailwind CSS + shadcn/ui | ^4.0 | Utility-first responsive design, modern dark/light styling |
| **State & Cache** | TanStack Query v5 + Zustand | ^5.104, ^5.0 | Server-state caching, background revalidation & UI state |
| **Forms** | React Hook Form + Zod | ^7.89, ^3.25 | Schema-validated forms with real-time feedback |
| **Auth & Routing** | Next.js Edge Middleware + JWT | Native | Edge route guards, cookie persistence, 1-Click Demo Login |
| **Payments** | Stripe SDK | ^10.0 | Real Stripe Checkout Session & redirection flows |
| **Data Visualization**| Recharts | ^3.10 | Interactive charts for university analytics |
| **Notifications** | Sonner | ^2.0 | Toast notification system |
| **Icons** | Lucide React | ^1.55 | Consistent SVG iconography |

---

## 👥 3 Distinct Roles & Dedicated Workflows

1. **👨‍💼 Administrator (Admin Portal)**
   - High-level analytics with interactive Recharts (Students, Faculties, Departments, Revenue).
   - CRUD management of Academic Departments, Semesters, Courses, Offerings, and Sections.
   - User Directory with Role and Status governance.
   - Comprehensive university tuition payment ledger.

2. **👨‍🏫 Faculty Member (Faculty Portal)**
   - Overview of assigned sections, weekly lecture schedules, and classrooms.
   - Live student rosters for enrolled courses.
   - Continuous assessment, midterm, and final marks entry with automatic GPA calculation.

3. **👨‍🎓 Student (Student Portal)**
   - ACID-safe course enrollment & withdrawal wizard with prerequisite verification.
   - Official Academic Transcript with Semester GPA and Cumulative CGPA.
   - Tuition fee invoicing with real **Stripe Checkout Session** initiation.

---

## 🔑 Dedicated Demo Credentials (1-Click Login Supported)

| Role | Email | Password | Quick One-Click Access |
|---|---|---|---|
| **ADMIN** | `admin@university.edu` | `AdminPassword123!` | Click "Admin Demo Login" on `/login` |
| **FACULTY** | `faculty@university.edu` | `FacultyPassword123!` | Click "Faculty Demo Login" on `/login` |
| **STUDENT** | `student@university.edu` | `StudentPassword123!` | Click "Student Demo Login" on `/login` |

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Abdulmazid24/B7A7.git
cd B7A7

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit: `http://localhost:3000`
