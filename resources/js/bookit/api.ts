import axios from 'axios';
import { Appointment, Employee, ActivityLog, OfficeSettings } from './types';

const API_BASE = '/api';

export function setAuthToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('officesync_auth_token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('officesync_auth_token');
  }
}

// Initialize on load if token exists
const savedToken = localStorage.getItem('officesync_auth_token');
if (savedToken) {
  setAuthToken(savedToken);
}

export const api = {
  login: async (email: string, password: string): Promise<{ token: string; user: Employee }> => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    if (res.data.token) {
      setAuthToken(res.data.token);
    }
    return { token: res.data.token, user: res.data.user };
  },
  logout: async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`);
    } catch (e) {
      // Ignore if token expired
    }
    setAuthToken(null);
  },
  getEmployees: async (): Promise<Employee[]> => {
    const res = await axios.get(`${API_BASE}/employees`);
    return res.data.data;
  },
  createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
    const res = await axios.post(`${API_BASE}/employees`, data);
    return res.data.data;
  },
  deleteEmployee: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/employees/${id}`);
  },
  updateEmployeeStatus: async (id: string, status: string, statusDetails?: string): Promise<Employee> => {
    const res = await axios.patch(`${API_BASE}/employees/${id}/status`, { status, status_details: statusDetails });
    return res.data.data;
  },
  getAppointments: async (): Promise<Appointment[]> => {
    const res = await axios.get(`${API_BASE}/appointments`);
    return res.data.data;
  },
  createAppointment: async (data: any): Promise<Appointment> => {
    const res = await axios.post(`${API_BASE}/appointments`, data);
    return res.data.data;
  },
  updateAppointmentStatus: async (id: string, status: string): Promise<Appointment> => {
    const res = await axios.patch(`${API_BASE}/appointments/${id}/status`, { status });
    return res.data.data;
  },
  reassignAppointment: async (id: string, newHostId: string): Promise<Appointment> => {
    const res = await axios.patch(`${API_BASE}/appointments/${id}/reassign`, { new_host_id: newHostId });
    return res.data.data;
  },
  deleteAppointment: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/appointments/${id}`);
  },
  getSettings: async (): Promise<OfficeSettings> => {
    const res = await axios.get(`${API_BASE}/settings`);
    return res.data;
  },
  updateSettings: async (settings: Partial<OfficeSettings>): Promise<OfficeSettings> => {
    const res = await axios.patch(`${API_BASE}/settings`, settings);
    return res.data;
  },
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    const res = await axios.get(`${API_BASE}/activity-logs`);
    return res.data.data;
  }
};
