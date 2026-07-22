/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  DashboardView,
  Appointment,
  Employee,
  ActivityLog,
  OfficeSettings
} from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_APPOINTMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SETTINGS
} from './data';
import { api } from './api';
import SideNavBar from './components/SideNavBar';
import TopAppBar from './components/TopAppBar';
import NewAppointmentModal from './components/NewAppointmentModal';
import DashboardMySchedule from './components/DashboardMySchedule';
import DashboardReceptionist from './components/DashboardReceptionist';
import DashboardManager from './components/DashboardManager';
import MeetingsCalendar from './components/MeetingsCalendar';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoginPage from './components/LoginPage';

export default function App() {
  // --- Master Persistence State Layer ---
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('officesync_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('officesync_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('officesync_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [settings, setSettings] = useState<OfficeSettings>(() => {
    const saved = localStorage.getItem('officesync_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // --- Auth State Layer ---
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('officesync_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (employee: Employee) => {
    setCurrentUser(employee);
    localStorage.setItem('officesync_current_user', JSON.stringify(employee));
    
    // Autofill initial active tab and dashboard perspective based on role
    if (employee.role.toLowerCase().includes('manager') || employee.role.toLowerCase().includes('vp')) {
      setDashboardPerspective('manager');
      setActiveTab('dashboard');
    } else if (employee.role.toLowerCase().includes('operations') || employee.role.toLowerCase().includes('reception')) {
      setDashboardPerspective('receptionist');
      setActiveTab('dashboard');
    } else {
      setDashboardPerspective('my_schedule');
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    api.logout().catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem('officesync_current_user');
  };

  // --- Live API Sync on Load / Login ---
  useEffect(() => {
    if (currentUser) {
      api.getAppointments().then(setAppointments).catch(() => {});
      api.getEmployees().then(setEmployees).catch(() => {});
      api.getActivityLogs().then(setActivityLogs).catch(() => {});
      api.getSettings().then(setSettings).catch(() => {});
    }
  }, [currentUser]);

  // --- Layout Navigation state ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dashboardPerspective, setDashboardPerspective] = useState<DashboardView>('receptionist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  // Synchronize master changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('officesync_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('officesync_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('officesync_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('officesync_settings', JSON.stringify(settings));
  }, [settings]);

  // --- Handlers & Controllers ---
  
  // Create Appointment
  const handleAddAppointment = (newAppt: Appointment) => {
    setAppointments((prev) => [newAppt, ...prev]);

    // Live API call
    api.createAppointment({
      title: newAppt.title,
      host_id: newAppt.hostId,
      visitor: {
        name: newAppt.visitorName,
        company: newAppt.visitorCompany,
        email: `${newAppt.visitorName.toLowerCase().replace(/\s+/g, '.')}@visitor.com`
      },
      date: newAppt.date,
      start_time: newAppt.startTime,
      end_time: newAppt.endTime,
      room: newAppt.room,
      is_private: newAppt.isPrivate,
      notes: newAppt.notes
    }).then((created) => {
      api.getAppointments().then(setAppointments).catch(() => {});
      api.getEmployees().then(setEmployees).catch(() => {});
      api.getActivityLogs().then(setActivityLogs).catch(() => {});
    }).catch(() => {});

    // Update Employee status if booked for today
    const todayStr = new Date().toISOString().split('T')[0];
    if (newAppt.date === todayStr) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === newAppt.hostId
            ? {
                ...emp,
                status: 'Busy',
                statusDetails: `Meeting: ${newAppt.title}`,
                meetingsCount: emp.meetingsCount + 1
              }
            : emp
        )
      );
    }

    // Append to Activity Logs
    const logEntry: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'invite',
      user: newAppt.visitorName,
      message: `scheduled a meeting "${newAppt.title}" with ${newAppt.hostName}.`,
      timestamp: 'Just now',
      timeISO: new Date().toISOString()
    };
    setActivityLogs((prev) => [logEntry, ...prev]);
  };

  // Delete/Cancel Appointment
  const handleDeleteAppointment = (id: string) => {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));

    api.deleteAppointment(id).then(() => {
      api.getActivityLogs().then(setActivityLogs).catch(() => {});
    }).catch(() => {});

    if (appt) {
      const logEntry: ActivityLog = {
        id: `act-${Date.now()}`,
        type: 'late',
        user: appt.visitorName,
        message: `cancelled the meeting "${appt.title}".`,
        timestamp: 'Just now',
        timeISO: new Date().toISOString()
      };
      setActivityLogs((prev) => [logEntry, ...prev]);
    }
  };

  // Quick Action Check-in / Checkout Status Toggle
  const handleCheckInToggle = (id: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );

    api.updateAppointmentStatus(id, newStatus).then(() => {
      api.getAppointments().then(setAppointments).catch(() => {});
      api.getEmployees().then(setEmployees).catch(() => {});
      api.getActivityLogs().then(setActivityLogs).catch(() => {});
    }).catch(() => {});

    const appt = appointments.find((a) => a.id === id);
    if (appt) {
      const message = newStatus === 'In Progress' ? 'checked in at reception.' : 'checked out.';
      const type = newStatus === 'In Progress' ? 'checkin' : 'checkout';

      const logEntry: ActivityLog = {
        id: `act-${Date.now()}`,
        type,
        user: appt.visitorName,
        message,
        timestamp: 'Just now',
        timeISO: new Date().toISOString()
      };
      setActivityLogs((prev) => [logEntry, ...prev]);

      // Update employee status if checked in
      if (newStatus === 'In Progress') {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === appt.hostId
              ? {
                  ...emp,
                  status: 'In Meeting',
                  statusDetails: `with ${appt.visitorName}`
                }
              : emp
          )
        );
      } else if (newStatus === 'Completed') {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === appt.hostId
              ? {
                  ...emp,
                  status: 'Available',
                  statusDetails: undefined
                }
              : emp
          )
        );
      }
    }
  };

  // Reassign appointment to another direct report (Host re-assignment workflow)
  const handleReassignMeeting = (apptId: string, newHostId: string) => {
    const targetEmployee = employees.find((e) => e.id === newHostId);
    if (!targetEmployee) return;

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === apptId
          ? {
              ...appt,
              hostId: newHostId,
              hostName: targetEmployee.name
            }
          : appt
      )
    );

    api.reassignAppointment(apptId, newHostId).then(() => {
      api.getAppointments().then(setAppointments).catch(() => {});
      api.getActivityLogs().then(setActivityLogs).catch(() => {});
    }).catch(() => {});

    const appt = appointments.find((a) => a.id === apptId);
    if (appt) {
      const logEntry: ActivityLog = {
        id: `act-${Date.now()}`,
        type: 'invite',
        user: 'Manager',
        message: `reassigned meeting "${appt.title}" to host ${targetEmployee.name}.`,
        timestamp: 'Just now',
        timeISO: new Date().toISOString()
      };
      setActivityLogs((prev) => [logEntry, ...prev]);
    }
  };

  // Toggle Time Lock
  const handleLockTimeToggle = () => {
    const nextVal = !settings.lockTimeEnabled;
    setSettings((prev) => ({
      ...prev,
      lockTimeEnabled: nextVal
    }));
    api.updateSettings({ lock_time_enabled: nextVal }).catch(() => {});
  };

  // Add Custom Employee
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [...prev, newEmp]);
  };

  // Delete Custom Employee
  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // --- Dynamic Search Query Filtering ---
  // When search query is entered, filter active appointments displayed in sub-screens
  const filteredAppointments = searchQuery
    ? appointments.filter(
        (appt) =>
          appt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.hostName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appointments;

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} employees={employees} />;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans antialiased overflow-x-hidden pb-16 md:pb-0">
      {/* Side Navigation panel (Fixed Desktop / Sticky Mobile Bottom) */}
      <SideNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
      />

      {/* Main Container Core */}
      <div className="md:ml-[280px] flex flex-col min-h-screen">
        {/* Global Toolbar Header */}
        <TopAppBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dashboardPerspective={dashboardPerspective}
          setDashboardPerspective={setDashboardPerspective}
          activityLogs={activityLogs}
          unreadCount={activityLogs.filter(log => log.timestamp === 'Just now').length}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Route/Tab Display Slabs */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <>
              {dashboardPerspective === 'my_schedule' && (
                <DashboardMySchedule
                  appointments={filteredAppointments}
                  onLockTimeToggle={handleLockTimeToggle}
                  isTimeLocked={settings.lockTimeEnabled}
                  onNavigateToCalendar={() => setActiveTab('meetings')}
                />
              )}

              {dashboardPerspective === 'receptionist' && (
                <DashboardReceptionist
                  appointments={filteredAppointments}
                  activityLogs={activityLogs}
                  onCheckInToggle={handleCheckInToggle}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}

              {dashboardPerspective === 'manager' && (
                <DashboardManager
                  appointments={filteredAppointments}
                  employees={employees}
                  onReassignMeeting={handleReassignMeeting}
                />
              )}
            </>
          )}

          {activeTab === 'meetings' && (
            <MeetingsCalendar
              appointments={filteredAppointments}
              employees={employees}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView appointments={appointments} employees={employees} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}
        </main>
      </div>

      {/* Creation Drawer popup Modal (Accessible globally from CTA buttons) */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        employees={employees}
        onAddAppointment={handleAddAppointment}
      />
    </div>
  );
}

