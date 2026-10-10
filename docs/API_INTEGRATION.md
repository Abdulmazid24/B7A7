# Apex University Management System - API Integration Guide

This document specifies the end-to-end integration contracts between the **Apex UMS Next.js Frontend (`B7A7`)** and the **Enterprise Node/Express Backend (`B7A6`)**.

---

## 1. Gateway & Connectivity Architecture

- **Base Production URL:** `https://b7-a6-kohl.vercel.app/api/v1`
- **Database Engine:** PostgreSQL via Prisma ORM on Neon Serverless DB
- **Authentication Model:** JWT Bearer Token (`Authorization: Bearer <token>`)
- **Transport Security:** Strict HTTPS, CORS preflight verification, JSON Body Parsers

### Request & Response Protocols

All API communications adhere to the universal JSON payload standard:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

Error responses conform to:

```json
{
  "success": false,
  "message": "Detailed error rationale",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Validation constraint violation"
    }
  ],
  "stack": "..." // Dev mode only
}
```

---

## 2. API Endpoint Matrix by Domain Module

### Module A: Authentication & Security (`/auth`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticates credentials and returns JWT access token + profile |
| `POST` | `/auth/register` | Public | Self-registration endpoint for prospective university students |
| `POST` | `/auth/refresh-token` | Public | Exchanges HTTP-only refresh cookie for refreshed access token |
| `POST` | `/auth/logout` | Authenticated | Invalidates current active session and clears auth cookies |

### Module B: User Governance (`/users`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/users` | `ADMIN` | Returns paginated list of accounts with profile relations |
| `GET` | `/users/:id` | `ADMIN` | Fetches comprehensive details for a specific user ID |
| `PATCH` | `/users/:id/role-status` | `ADMIN` | Updates system role or account lifecycle status (`ACTIVE`/`BLOCKED`) |
| `DELETE` | `/users/:id` | `ADMIN` | Soft-deletes user record and deactivates associated credentials |

### Module C: Academic Departments (`/departments`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/departments` | Public | Lists all active academic departments across faculties |
| `POST` | `/departments` | `ADMIN` | Creates new department with unique code |
| `PATCH` | `/departments/:id` | `ADMIN` | Modifies department name or scope description |
| `DELETE` | `/departments/:id` | `ADMIN` | Deletes department (checks foreign key integrity) |

### Module D: Academic Semesters (`/semesters`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/semesters` | Public | Returns semesters with registration window dates |
| `POST` | `/semesters` | `ADMIN` | Creates new academic term (e.g., Spring 2026) |
| `PATCH` | `/semesters/:id` | `ADMIN` | Toggles enrollment open/closed boolean state |
| `DELETE` | `/semesters/:id` | `ADMIN` | Deletes academic semester term |

### Module E: Course Catalog (`/courses`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/courses` | Public | Returns courses with credit values and department relations |
| `POST` | `/courses` | `ADMIN` | Registers new accredited course in catalog |
| `PATCH` | `/courses/:id` | `ADMIN` | Updates course title, credits, or prerequisites |
| `DELETE` | `/courses/:id` | `ADMIN` | Removes course from catalog |

### Module F: Section Offerings (`/course-offerings`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/course-offerings` | Public / All | Returns scheduled sections with remaining capacity and room |
| `POST` | `/course-offerings` | `ADMIN` | Schedules new section offering and assigns faculty member |
| `PATCH` | `/course-offerings/:id` | `ADMIN` | Adjusts seat capacity, room number, or timeslot |
| `DELETE` | `/course-offerings/:id` | `ADMIN` | Cancels course offering |

### Module G: Course Registrations (`/course-registrations`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/course-registrations/my-courses`| `STUDENT` | Fetches active enrolled courses for current semester |
| `POST` | `/course-registrations/enroll` | `STUDENT` | Enrolls student into section offering with ACID seat decrement |
| `DELETE` | `/course-registrations/drop/:id`| `STUDENT` | Drops course enrollment and restores section seat atomically |

### Module H: Faculty Grading & Transcript (`/grades`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/grades/my-transcript` | `STUDENT` | Computes official CGPA, term GPA, and grade history |
| `POST` | `/grades/submit` | `FACULTY` | Publishes 100-pt marks matrix with automatic UGC grade point |

### Module I: Tuition Fees & Stripe Checkout (`/payments`)

| Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/payments/my-invoices` | `STUDENT` | Lists tuition fee statements and payment statuses |
| `POST` | `/payments/create-checkout-session`| `STUDENT` | Generates Stripe Checkout redirect URL |
| `GET` | `/payments` | `ADMIN` | Audits global tuition ledger and Stripe checkout sessions |

---

## 3. Concurrency & ACID Guarantees

The course enrollment flow employs PostgreSQL database transactions (`prisma.$transaction`) with `Serializable` or row-level locking:
1. Verifies student tuition eligibility.
2. Asserts course prerequisites are met.
3. Checks section `capacity > enrolledCount`.
4. Increments `enrolledCount` and inserts `CourseRegistration` record atomically.
5. In case of concurrent seat depletion, rolls back with clean `400 Bad Request: Section is at maximum capacity`.
