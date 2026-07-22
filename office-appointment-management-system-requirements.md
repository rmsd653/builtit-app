# Office Appointment Management System — Software Requirements

## Overview
A web-based, mobile-friendly appointment management application for an office, aimed at improving employee productivity, reducing visitor waiting time, and providing performance insights via dashboards and reports.

## Features

### 1. Appointment Scheduling
- Priority: Must-have
- User role: Receptionist
- Description: Receptionist creates meetings based on visitor's stated requirement, selecting the appropriate employee.
- Details/constraints: Visitor name, contact, date & time mandatory; other fields optional and configurable.
- Acceptance criteria: Receptionist can create a meeting with mandatory fields and assign it to an employee within defined work hours.

### 2. Availability & Double-Booking Prevention
- Priority: Must-have
- Description: System shows only free slots for an employee based on work hours, existing meetings, and locks. If unavailable, receptionist can pick another employee or reschedule.
- Acceptance criteria: No two meetings can be booked for the same employee at overlapping times.

### 3. Meeting Visibility (Receptionist)
- Priority: Must-have
- User role: Receptionist
- Description: View all upcoming and ongoing meetings across all employees. Private meetings show as "booked" without details. Meetings starting soon are highlighted.
- Acceptance criteria: Receptionist sees full meeting list (minus private details), with soon-to-start meetings visually flagged.

### 4. Private Meetings
- Priority: Must-have
- User role: Manager
- Description: Managers can mark a meeting private; receptionist sees the slot as booked but not the details.
- Acceptance criteria: Private meeting details hidden from receptionist view; slot still blocks scheduling.

### 5. Employee Time Locks
- Priority: Must-have
- User role: Employee, Manager
- Description: Employees can lock time periods (one-time or recurring) during which no meetings can be scheduled. Managers can also lock time for their employees.
- Details/constraints: Recurring locks have an optional end date. If no end date, availability is computed dynamically at check-time (not stored as individual occurrence records).
- Acceptance criteria: Locked periods are unavailable for scheduling; indefinite recurring locks don't generate stored per-occurrence rows.

### 6. Manager Takeover
- Priority: Must-have
- User role: Manager
- Description: Manager can reassign an employee's meeting to themselves.
- Acceptance criteria: Meeting fully reassigned to manager; original employee notified.

### 7. Meeting Agenda
- Priority: Must-have
- User role: Assigned Employee
- Description: Agenda added at creation and editable later; supports checklist and/or plain text.
- Acceptance criteria: Only the assigned employee can create/edit the agenda.

### 8. Meeting Output/Outcome
- Priority: Must-have
- User role: Assigned Employee
- Description: Outcome recorded after meeting for future reference; supports checklist and/or plain text.
- Acceptance criteria: Only the assigned employee can add/edit outcome; saved for future reference.

### 9. Visitor History
- Priority: Must-have
- Description: Past agendas/outputs for a visitor shown when booking a new meeting for the same contact.
- Acceptance criteria: Booking screen surfaces prior meeting history for a matching contact.

### 10. Meeting Status Tracking
- Priority: Must-have
- Description: Explicit status lifecycle — Scheduled → Ongoing → Completed → No-show/Cancelled.
- Acceptance criteria: Every meeting has one of the defined statuses, used across dashboards/reports.

### 11. In-App Notifications
- Priority: Must-have
- Description: In-app alerts to employee and visitor-facing staff before a meeting starts.
- Acceptance criteria: Notification triggers before scheduled meeting time.

### 12. Performance Metrics
- Priority: Must-have
- Description: Tracks meetings handled, duration, outcomes completed, punctuality, and agenda-to-outcome completion rate — reviewable daily/weekly/monthly/yearly.

### 13. Dashboards
- Priority: Must-have
- User role: Employee, Receptionist, Manager
- Description:
  - Employee: today's meetings, upcoming meetings (min. 5).
  - Receptionist: all non-past/non-completed meetings, with soon-to-start highlighted.
  - Manager: own meetings + assigned employees' meetings.
- Acceptance criteria: Each role sees the dashboard view as specified above.

### 14. Detailed Reports
- Priority: Must-have
- User role: Admin, Manager
- Description: Reports with all filters (date range, employee, meeting type, etc.) and modern chart visualizations (multiple chart types).
- Acceptance criteria: Admin/manager can filter and view charted performance data.

### 15. Admin Controls
- Priority: Must-have
- User role: Admin
- Description: Manage employee/manager/receptionist accounts, assign employees to managers, set global work hours, view org-wide reports.
- Acceptance criteria: Admin can perform all listed management actions.

## Out of Scope
- Online booking by visitors (V2)
- Per-employee work hours (V2)
- AI-driven insights & reports (V2)
- Email/SMS/WhatsApp notifications (V2)

## Non-Functional Requirements
- Platform: Web app, mobile-friendly/responsive
- Stack: Laravel + MariaDB

## Confirmed By
Client confirmed on 2026-07-21.
