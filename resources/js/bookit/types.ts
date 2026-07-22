export interface Appointment {
  id: string;
  title: string;
  visitorName: string;
  visitorCompany?: string;
  hostId: string; // references Employee.id
  hostName: string;
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "11:30 AM"
  room: string;
  status: 'Ongoing' | 'Pending' | 'Starting Soon' | 'In Progress' | 'Expected' | 'Booked' | 'Completed' | 'No-Show';
  date: string; // YYYY-MM-DD
  isPrivate: boolean;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  status: 'Available' | 'In Meeting' | 'Offline' | 'OOO' | 'Busy';
  statusDetails?: string; // e.g., "until 11:00"
  meetingsCount: number;
  punctuality: number; // percentage, e.g. 98
  avgDuration: number; // minutes, e.g. 45
  agendaCompletion: number; // percentage, e.g. 92
}

export interface ActivityLog {
  id: string;
  type: 'checkout' | 'invite' | 'late' | 'checkin' | 'created';
  user: string;
  message: string;
  timestamp: string; // e.g. "10 mins ago"
  timeISO: string; // for sorting
}

export type ActiveTab = 'dashboard' | 'meetings' | 'reports' | 'settings';

export type DashboardView = 'my_schedule' | 'receptionist' | 'manager';

export interface OfficeSettings {
  workingHoursStart: string;
  workingHoursEnd: string;
  lockTimeEnabled: boolean;
  notifyOnLate: boolean;
  autoCheckout: boolean;
  defaultMeetingDuration: number; // minutes
}
