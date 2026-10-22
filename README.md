# 🎓 Apex University Management System (UMS) - Fullstack Portal
> **Programming Hero Level-2 Batch 7 | Assignment 7 (Fullstack Milestone)**  
> **Student ID Last Digit: 9 (University Management System)**  
> **Author:** Abdul Mazid (`Abdulmazid24`)  
> **Frontend Repository:** [https://github.com/Abdulmazid24/B7A7.git](https://github.com/Abdulmazid24/B7A7.git)  
> **Backend Repository:** [https://github.com/Abdulmazid24/B7A6.git](https://github.com/Abdulmazid24/B7A6.git)  
> **Live Backend API:** [https://b7-a6-kohl.vercel.app](https://b7-a6-kohl.vercel.app)  

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?logo=react-query)](https://tanstack.com/query)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635bff?logo=stripe)](https://stripe.com/)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 📌 Submission Information (Exact Required Format)

```text
Project Name            : University Management System (UMS)
Backend Repo            : https://github.com/Abdulmazid24/B7A6.git
Frontend Repo           : https://github.com/Abdulmazid24/B7A7.git
Live Backend URL        : https://b7-a6-kohl.vercel.app
Live Frontend URL       : https://b7-a7-lac.vercel.app
API Documentation       : https://documenter.getpostman.com/view/58861661/2sBYHQ2i1P
Demo Video              : https://www.loom.com/share/placeholder
Demo Admin Email        : admin@university.edu
Demo Admin Password     : AdminPassword123!
```

---

## 🌟 Executive Overview
**Apex University Management System (UMS)** is an enterprise-grade, high-concurrency academic enterprise resource planning (ERP) platform engineered with **Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, TanStack Query v5, Zustand, and Stripe Gateway**.

It directly integrates with our deployed **B7A6 REST Backend** (`https://b7-a6-kohl.vercel.app/api/v1`), providing seamless, role-segregated workflows for **Administrators, Faculty members, and Students**.

---

## 🛠️ Technology Stack & Latest Stable Versions

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.4.0 | Server & Client Components, Turbopack, Edge Middleware |
| **Language** | TypeScript | ^5.8 | Strict compile-time type safety across all domain models |
| **Styling** | Tailwind CSS + shadcn | ^4.0 | Responsive design, modern dark/light mode palette |
| **State & Cache** | TanStack Query v5 + Zustand | ^5.104, ^5.0 | Async server-state caching, automatic cache invalidation |
| **Form Engine** | React Hook Form + Zod | ^7.89, ^3.25 | Schema-validated forms with real-time field error messaging |
| **Auth & Routing** | Next.js Edge Middleware + JWT | Native | Edge route guards, cookie persistence, 1-Click Demo Login |
| **Payments** | Stripe SDK | ^10.0 | Stripe Checkout Session creation and webhook capture |
| **Visual Analytics** | Recharts | ^3.10 | Responsive interactive charts for university revenue & stats |
| **Feedback & Audio** | Sonner + Web Audio API | ^2.0 | Toast notifications and synthesized sound feedback |
| **Iconography** | Lucide React | ^1.55 | Consistent, accessible SVG iconography |

---

## 👥 3 Distinct Roles & Complete Portal Workflows

### 1. 👨‍💼 Administrator (Admin Portal)
- **Executive Dashboard (`/admin`):** Live KPI metric cards (Active Students, Faculty, Course Offerings, Net Tuition Revenue) and interactive 6-month financial area chart.
- **Academic Departments (`/admin/departments`):** Real-time department directory with interactive creation modal and deletion guard.
- **Course Catalog (`/admin/courses`):** Complete curriculum inventory with credit weights, prerequisite mapping, and department affiliation.
- **Academic Semesters (`/admin/semesters`):** Management of academic terms with one-click enrollment window open/close toggles.
- **Section Offerings (`/admin/offerings`):** Room assignments, section caps, faculty staffing, and schedules.
- **User Governance (`/admin/users`):** Debounced user directory with role promotion (`ADMIN`, `FACULTY`, `STUDENT`) and lifecycle locking (`ACTIVE`, `BLOCKED`).
- **Payment Ledger (`/admin/payments`):** Live financial ledger with CSV export and Stripe transaction audit IDs.

### 2. 👨‍🏫 Faculty Member (Faculty Portal)
- **Teaching Overview (`/faculty`):** Real-time classroom timetable, assigned weekly contact hours, and department announcements.
- **Assigned Sections (`/faculty/sections`):** Detailed section rosters with CSV export of enrolled candidates.
- **Real-Time Grading Matrix (`/faculty/grading`):** 100-point continuous assessment matrix (Class Test /20, Midterm /30, Final /50) with automated UGC 4.0 grading math and instant student transcript publication.

### 3. 👨‍🎓 Student (Student Portal)
- **Student Dashboard (`/student`):** Cumulative CGPA indicator, earned credits tally, registered semester summary, and quick navigation.
- **ACID Course Registration (`/student/registration`):** Real-time section enrollment wizard with prerequisite validation, atomic seat reservation, and instant drop support.
- **Official Transcript (`/student/transcript`):** Certified academic transcript with semester GPAs, printable layout with official seal and registrar signature blocks.
- **Tuition Statements & Stripe Checkout (`/student/invoices`):** Tuition invoice breakdown with one-click redirect to live Stripe Checkout Test Mode.

---

## 🔑 Dedicated Demo Credentials (1-Click Login Supported)

The login screen (`/login`) features **Mandatory One-Click Demo Access buttons** for instant evaluation without typing:

| Role | Email | Password | 1-Click Button |
|---|---|---|---|
| **ADMIN** | `admin@university.edu` | `AdminPassword123!` | ⚡ **Admin Demo Login** |
| **FACULTY** | `faculty@university.edu` | `FacultyPassword123!` | ⚡ **Faculty Demo Login** |
| **STUDENT** | `student@university.edu` | `StudentPassword123!` | ⚡ **Student Demo Login** |

---

## 🗺️ 26 Implemented Application Routes

- **Public (7):**
  - `/` - Enterprise Homepage with Hero, Stats, Role Cards, & Testimonials
  - `/about` - University Mission, Governance, & Academic Heritage
  - `/academics` - Comprehensive Degree Programs & Curricula
  - `/tuition` - Transparent Credit Fee Calculator & Financial Aid Matrix
  - `/contact` - Campus Directory & Inquiry Form
  - `/faq` - Frequently Asked Questions Accordion
  - `/_not-found` - 404 Error Fallback Screen
- **Authentication (2):**
  - `/login` - 1-Click Demo Login & Credential Authentication
  - `/register` - Student Self-Registration Portal
- **Admin Portal (7):**
  - `/admin` - Analytics Dashboard
  - `/admin/departments` - Department Governance
  - `/admin/courses` - Course Catalog
  - `/admin/semesters` - Semester Management
  - `/admin/offerings` - Section Offerings
  - `/admin/users` - User Directory & RBAC Controls
  - `/admin/payments` - University Payment Ledger
- **Faculty Portal (3):**
  - `/faculty` - Teaching Schedule & Overview
  - `/faculty/sections` - Enrolled Student Rosters
  - `/faculty/grading` - Real-Time 100-Point Grading Matrix
- **Student Portal (4):**
  - `/student` - Student Portal Overview
  - `/student/registration` - ACID Course Registration Wizard
  - `/student/transcript` - Certified Academic Transcript
  - `/student/invoices` - Tuition Fees & Invoicing
- **Payment Lifecycle & Webhooks (2):**
  - `/payment/success` - Stripe Payment Confirmation
  - `/payment/cancel` - Stripe Payment Cancellation & Retry
- **SEO & Search Engines (3):**
  - `/sitemap.xml` (via `src/app/sitemap.ts`)
  - `/robots.txt` (via `src/app/robots.ts`)
  - `/manifest.webmanifest` (via `src/app/manifest.ts`)

---

## 🚀 Local Setup & Installation

```bash
# 1. Clone frontend repository
git clone https://github.com/Abdulmazid24/B7A7.git
cd B7A7

# 2. Install dependencies
npm install

# 3. Configure local environment variables
cp .env.example .env.local

# 4. Verify TypeScript compilation and production build
npm run build

# 5. Start development server
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Unit Testing

Unit tests for grading calculations, formatting utilities, and security sanitization are available in `src/__tests__/`:

```bash
# Run unit test suites
npx vitest run || npm test
```

---

## 📜 Architectural Documentation

For in-depth engineering breakdowns, refer to:
- [System Architecture & State Management](docs/ARCHITECTURE.md)
- [API Integration & Endpoint Contracts](docs/API_INTEGRATION.md)
