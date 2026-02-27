# Bayside / Community Care Hospital Web App – Codebase Documentation

## 1) Project Overview

This project is a multi-page, static frontend hospital web application built with:
- HTML (page structure)
- CSS (shared + page-specific styling)
- Vanilla JavaScript (DOM logic + localStorage persistence)

There is no backend/API integration in this codebase. All dynamic data persistence is handled in the browser using `localStorage`.

---

## 2) High-Level Architecture

### 2.1 Folder Structure
- `index.html` – Home page
- `department.html` – Departments listing and filters
- `appointment.html` – Appointment booking form
- `queue.html` – Real-time queue view (based on today's appointments)
- `dashboard.html` – Admin-like appointment management page
- `contact.html` – Contact form page
- `css/` – Shared and page-specific stylesheets
- `js/` – Shared and page-specific JavaScript modules (global scripts)
- `images/` – Logo, page assets, and slider images

### 2.2 Runtime Model
This app uses classic script tags (no bundler/module system).
- Functions and constants are loaded into the global scope.
- Page scripts run on `DOMContentLoaded` and initialize only their page features.

Key shared scripts:
- `js/core.js` – Utilities, form validation, navigation behavior, localStorage data helpers
- `js/data.js` – Static hospital/departments/doctors/service metadata

Page scripts:
- `js/home.js`
- `js/slide.js`
- `js/department.js`
- `js/appointment-page.js`
- `js/queue-page.js`
- `js/dashboard-page.js`
- `js/contact-page.js`

### 2.3 Script Dependency Rules
- `appointment.html` and `department.html` **must load `data.js` before their page scripts**, because they rely on global `departments` and helper functions from `data.js`.
- All pages that use utilities (date/time clock, form validation, localStorage helpers) load `core.js`.

---

## 3) Data Layer (Browser localStorage)

All persistent state is stored with these keys:

1. `hospital_appointments`
   - Array of appointment objects.
   - Created from `appointment.html`; consumed/updated by `queue.html` and `dashboard.html`.

2. `hospital_contact_messages`
   - Array of contact message objects.
   - Created from `contact.html`.

3. `hospital_queue_status`
   - Object: `{ nowServing: string|null, queueIndex: number }`
   - Used by `queue.html` to track current serving ticket.

### 3.1 Appointment Object Shape
Generated in `js/appointment-page.js`:
- `ticketId` (e.g., `HSP-2026-0001`)
- `fullName`, `phone`, `gender`, `age`
- `department`, `departmentId`
- `doctor`, `doctorId`
- `date`, `timeSlot`, `symptoms`
- `status` (`Pending` initially)
- `createdAt` (ISO timestamp)

### 3.2 Queue Status Shape
Stored by `core.js`:
- `nowServing`: ticket ID currently being served
- `queueIndex`: index in sorted pending list

### 3.3 Contact Message Shape
Saved by `core.js/saveContactMessage`:
- user payload: `name`, `email`, `subject`, `message`
- generated metadata: `id` (`MSG-<timestamp>`), `date` (ISO timestamp)

---

## 4) Shared JavaScript (`js/core.js`)

`core.js` is the operational backbone for all pages.

### 4.1 Date/Time Utilities
- `formatDate(date)` → localized long date (`en-GB`)
- `formatTime(date)` → localized time with seconds (`en-GB`)
- `getTodayDate()` → `YYYY-MM-DD`
- `updateDateTime()` updates `#live-date` and `#live-time`
- `initDateTimeClock()` starts 1-second timer

### 4.2 Appointments Storage API
- `getAppointments()`
- `saveAppointment(appointment)`
- `updateAppointment(ticketId, updates)`
- `deleteAppointment(ticketId)`
- `generateTicketId()` uses current year + running count in storage

### 4.3 Contact Storage API
- `getContactMessages()`
- `saveContactMessage(message)`

### 4.4 Queue Storage API
- `getQueueStatus()`
- `setQueueStatus(status)`
- `resetQueue()`

### 4.5 Navigation + UX
- `initNavigation()`:
  - handles mobile menu toggle (`.mobile-menu-btn`, `.nav-links`)
  - applies active nav class based on current URL path

### 4.6 Form Validation
- `validateField(field)` validates required fields + special field rules:
  - phone format for Ghana (`+233...` or `0...`)
  - age range (0–150)
  - appointment date not in the past
  - email pattern
- `validateForm(form)` applies validation to required form controls

### 4.7 Shared Page Boot
- `initCommonPageFeatures()` = `initNavigation()` + `initDateTimeClock()`

---

## 5) Static Data Source (`js/data.js`)

Contains non-persistent static content for department-related pages:
- `hospitalData` metadata
- `departments` array with nested `doctors`
- `services` array
- `timeSlots` list

Helper lookup functions:
- `getDepartmentById(id)`
- `getDoctorById(doctorId)`
- `getDoctorsByDepartment(deptId)`

Also includes a Node-style export guard at the bottom:
- `if (typeof module !== 'undefined' && module.exports) ...`
This doesn’t affect browser runtime, but enables potential reuse in testing/Node contexts.

---

## 6) Page-by-Page Documentation

## 6.1 Home Page

### Files
- `index.html`
- `css/style.css`
- `css/slide.css`
- `js/core.js`
- `js/home.js`
- `js/slide.js`

### Behavior
- Shared header + emergency banner + footer
- Hero slider section (`.hero-slider`) with arrows and dots
- Informational sections (services, quick info)
- Date/time clock and responsive nav from `core.js`
- Slider functionality from `slide.js`

### Slider logic (`js/slide.js`)
- Locates `.hero-slider .slider`
- Builds dot navigation dynamically based on number of `.slide` items
- Implements:
  - next/prev controls
  - direct navigation via dots
  - auto-advance every 5 seconds
- Updates track using CSS transform: `translateX(-N%)`

### Home bootstrap (`js/home.js`)
- On DOM ready: only calls `initCommonPageFeatures()`

---

## 6.2 Departments Page

### Files
- `department.html`
- `css/style.css`
- `css/departments.css`
- `js/data.js`
- `js/core.js`
- `js/department.js`

### Behavior
- Renders all departments and their doctors from `departments` data.
- Search input (`#department-search`) filters by department name, description, and doctor names.
- Filter buttons (`.filter-btn`) narrow cards by department ID (`all`, `opd`, `pediatrics`, `maternity`).
- Each department card links to appointment page with query param: `appointment.html?dept=<departmentId>`.

### Core functions (`js/department.js`)
- `renderDepartments()` builds cards into `#departments-container`
- `filterDepartments(searchTerm, filter)` applies card visibility rules
- `initDepartmentSearch()` wires input and filter button events

---

## 6.3 Appointment Page

### Files
- `appointment.html`
- `css/style.css`
- `css/appointment.css`
- `js/data.js`
- `js/core.js`
- `js/appointment-page.js`

### Behavior
- Form collects patient profile + appointment details.
- Department dropdown populated from `departments` dataset.
- Doctor dropdown is dynamically dependent on selected department.
- URL query preselection supported: `?dept=<id>`.
- Form validates through `validateForm` + field-level validation from `core.js`.
- On success:
  - appointment object is generated
  - saved to `hospital_appointments`
  - form is replaced with confirmation card and ticket details

### Core functions (`js/appointment-page.js`)
- `populateDepartments()`
- `populateDoctors(deptId)`
- `handleAppointmentSubmit(event)`
- `showAppointmentConfirmation(appointment)`
- `initAppointmentForm()`

---

## 6.4 Queue Page

### Files
- `queue.html`
- `css/style.css`
- `css/queue.css`
- `js/core.js`
- `js/queue-page.js`

### Behavior
- Displays today’s appointments only (`apt.date === getTodayDate()`).
- Shows queue stats (total, waiting, served).
- Shows ordered queue list by `createdAt` timestamp.
- Queue controls:
  - `Next Patient` marks current serving as served, then advances to next pending appointment.
  - `Reset Queue` clears `nowServing` pointer only.

### Core functions (`js/queue-page.js`)
- `getTodayAppointments()`
- `renderQueue()`
- `nextPatient()`
- `initQueuePage()`

### Status rendering logic
Each queue item visual class is based on appointment state:
- `now-serving` (from queue status)
- `served`
- `cancelled`
- default pending

---

## 6.5 Dashboard Page

### Files
- `dashboard.html`
- `css/style.css`
- `css/dashboard.css`
- `js/core.js`
- `js/dashboard-page.js`

### Behavior
- Admin-style overview using all appointments in storage.
- Dashboard cards show total, today, served, cancelled, pending.
- Search input filters table by ticket ID, patient name, department.
- Row actions:
  - mark as served
  - mark as cancelled
  - delete appointment
- All actions persist via `core.js` storage helpers and trigger rerender.

### Core functions (`js/dashboard-page.js`)
- `renderDashboardStats()`
- `renderAppointmentsTable(filter)`
- `initDashboardSearch()`
- `markAsServed(ticketId)`
- `markAsCancelled(ticketId)`
- `deleteAppointmentConfirm(ticketId)`
- `initDashboard()`

---

## 6.6 Contact Page

### Files
- `contact.html`
- `css/style.css`
- `css/contact.css`
- `js/core.js`
- `js/contact-page.js`

### Behavior
- Contact form with required `name`, `email`, `message`, optional `subject`.
- Uses shared validation from `core.js`.
- On successful submit:
  - saves message to `hospital_contact_messages`
  - replaces form UI with success block
  - provides `Send Another Message` action (`location.reload()`)

### Core functions (`js/contact-page.js`)
- `handleContactSubmit(event)`
- `initContactForm()`

---

## 7) CSS Architecture

## 7.1 Shared Styles (`css/style.css`)
Defines design system and core layouts:
- CSS variables (`:root`) for colors, typography, spacing, border/shadow/radius tokens
- Reset + base typography
- Common layout utility (`.container`, `.section`, `.section-header`)
- Header/nav + mobile menu behavior classes
- Emergency banner styles
- Reusable button system (`.btn`, variants)
- Home hero, services, quick info sections
- Footer styles
- Generic page-header styles
- Responsive breakpoints (992, 768, 480)
- Print styles

## 7.2 Home Slider Styles (`css/slide.css`)
- Full viewport hero slider visuals
- Overlay gradient, text positioning
- Arrow controls + dots styling
- `hero-logo` dimensions

## 7.3 Page-specific Styles
- `css/appointment.css` – form grids, controls, errors, confirmation card
- `css/contact.css` – contact two-column layout, contact card list, success state
- `css/departments.css` – departments card grid, search/filter controls, themed page header background image
- `css/queue.css` – queue stats, row states (`now-serving`, `served`, `cancelled`), responsive queue list
- `css/dashboard.css` – dashboard stats cards, table, row/action styles

---

## 8) End-to-End Functional Flows

## 8.1 Booking to Queue to Dashboard
1. User books appointment on `appointment.html`.
2. `appointment-page.js` creates appointment record with `status: Pending` and stores it.
3. `queue.html` reads today’s appointments and displays queue.
4. `dashboard.html` shows all appointments and allows status transitions (`Pending` → `Served`/`Cancelled`) or delete.
5. Queue and dashboard always read from the same source of truth (`hospital_appointments`).

## 8.2 Department-to-Appointment Handoff
1. User clicks “Book Appointment” from a department card.
2. Link includes query parameter `?dept=<id>`.
3. Appointment page preselects that department and populates doctors list.

## 8.3 Contact Message Capture
1. User submits contact form.
2. Validation runs.
3. Message with metadata is appended to `hospital_contact_messages`.

---

## 9) File Connection Map

## HTML → CSS/JS wiring
- `index.html`
  - CSS: `css/style.css`, `css/slide.css`
  - JS: `js/core.js`, `js/home.js`, `js/slide.js`

- `department.html`
  - CSS: `css/style.css`, `css/departments.css`
  - JS: `js/data.js`, `js/core.js`, `js/department.js`

- `appointment.html`
  - CSS: `css/style.css`, `css/appointment.css`
  - JS: `js/data.js`, `js/core.js`, `js/appointment-page.js`

- `queue.html`
  - CSS: `css/style.css`, `css/queue.css`
  - JS: `js/core.js`, `js/queue-page.js`

- `dashboard.html`
  - CSS: `css/style.css`, `css/dashboard.css`
  - JS: `js/core.js`, `js/dashboard-page.js`

- `contact.html`
  - CSS: `css/style.css`, `css/contact.css`
  - JS: `js/core.js`, `js/contact-page.js`

---

## 10) Important Implementation Notes

1. Global scope reliance
   - Scripts expect globally available functions/constants (e.g., `departments`, `getAppointments`, `validateForm`).
   - Changing script order can break pages.

2. Data consistency
   - The site uses both “Community Care Hospital” and “Bayside Community Hospital” in text content.
   - This is a content-level inconsistency, not a runtime bug.

3. `js/script.js` appears unused
   - Contains canvas animation logic for an element `#terrain`.
   - No current HTML page references `js/script.js` or defines a `#terrain` canvas.
   - Treated as leftover/experimental file unless intentionally planned.

4. Dashboard cancelled-row style typo
   - In `css/dashboard.css`, there is `.data-table tr.Status-cancelled` (capital `S`) while JS outputs `status-cancelled`.
   - This causes cancelled row opacity style not to apply as intended.

---

## 11) How to Extend the Project Safely

1. Add a new page
   - Reuse `style.css` + `core.js`.
   - Set `body data-page` and include standard header/footer pattern.

2. Add a new department
   - Update `departments` in `js/data.js`.
   - Department page and appointment page will automatically reflect it.

3. Add appointment fields
   - Update form markup (`appointment.html`).
   - Add validation rule in `core.js` if needed.
   - Include field mapping in `handleAppointmentSubmit`.
   - Update dashboard/queue renderers if field should be displayed.

4. Replace localStorage with backend later
   - Keep UI scripts mostly unchanged by swapping `core.js` storage helper internals.

---

## 12) Quick Troubleshooting Guide

- Department/doctor dropdown empty on appointment page:
  - Confirm `js/data.js` is loaded before `js/appointment-page.js`.

- Queue not showing expected appointments:
  - Queue only shows records whose `date` equals today (`YYYY-MM-DD`).

- Active nav item not highlighted:
  - `initNavigation()` compares link `href` to current pathname’s filename.

- Data appears lost:
  - localStorage is browser-profile-specific and can be cleared by user actions.

---

## 13) Summary

This codebase is a clean, lightweight multi-page frontend architecture centered on:
- shared utility logic in `core.js`
- static medical metadata in `data.js`
- page-specific controllers for rendering and interactions
- localStorage as the single persistence layer

The most important cross-page relationship is the appointment lifecycle:
`appointment.html` creates records → `queue.html` consumes and advances queue status → `dashboard.html` provides management and status control.
