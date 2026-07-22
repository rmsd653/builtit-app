import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, Check, AlertTriangle, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { Appointment, ActivityLog } from '../types';

interface DashboardReceptionistProps {
  appointments: Appointment[];
  activityLogs: ActivityLog[];
  onCheckInToggle: (id: string, newStatus: Appointment['status']) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function DashboardReceptionist({
  appointments,
  activityLogs,
  onCheckInToggle,
  selectedDate,
  setSelectedDate
}: DashboardReceptionistProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'upcoming'>('all');

  // Filter today's meetings for summary statistics
  const todayISO = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((appt) => appt.date === todayISO);

  // Statistics
  const totalTodayCount = todayAppointments.length;
  const pendingCheckinsCount = todayAppointments.filter(
    (appt) => appt.status === 'Pending' || appt.status === 'Starting Soon' || appt.status === 'Expected'
  ).length;
  const activeMeetingsCount = todayAppointments.filter(
    (appt) => appt.status === 'Ongoing' || appt.status === 'In Progress'
  ).length;

  // Filter meetings for the SELECTED date (defaults to today, customizable via mini-calendar!)
  const selectedDateAppointments = appointments.filter((appt) => appt.date === selectedDate);
  
  // Sort by start time
  const sortedAppointments = [...selectedDateAppointments].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const displayedAppointments = filterMode === 'upcoming'
    ? sortedAppointments.filter(appt => appt.status !== 'Completed' && appt.status !== 'No-Show')
    : sortedAppointments;

  // Render initials or avatar
  const renderVisitorAvatar = (name: string, company?: string) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-xs">
        {initials || 'V'}
      </div>
    );
  };

  // Status badging helper
  const renderStatusBadge = (appt: Appointment) => {
    const status = appt.status;
    let badgeClass = '';
    let dotClass = '';

    switch (status) {
      case 'Starting Soon':
        badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        dotClass = 'bg-amber-500';
        break;
      case 'Ongoing':
      case 'In Progress':
        badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
        dotClass = 'bg-blue-500';
        break;
      case 'Expected':
      case 'Pending':
        badgeClass = 'bg-slate-50 text-slate-700 border-slate-200';
        dotClass = 'bg-slate-400';
        break;
      case 'Booked':
        badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
        dotClass = 'bg-purple-500';
        break;
      case 'Completed':
        badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        dotClass = 'bg-emerald-500';
        break;
      case 'No-Show':
        badgeClass = 'bg-red-50 text-red-700 border-red-200';
        dotClass = 'bg-red-500';
        break;
      default:
        badgeClass = 'bg-slate-50 text-slate-500 border-slate-200';
        dotClass = 'bg-slate-400';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
        {status}
      </span>
    );
  };

  // Mini Calendar Generation
  const generateCalendarDays = () => {
    const startOfOctober = new Date(2026, 9, 1); // Oct 2026 for alignment
    const days: { dateStr: string; dayNum: number; isSelected: boolean; isCurrentMonth: boolean }[] = [];

    // Prepend previous month days (Sept padding, 3 days to match mockup)
    days.push({ dateStr: '2026-09-28', dayNum: 28, isSelected: false, isCurrentMonth: false });
    days.push({ dateStr: '2026-09-29', dayNum: 29, isSelected: false, isCurrentMonth: false });
    days.push({ dateStr: '2026-09-30', dayNum: 30, isSelected: false, isCurrentMonth: false });

    // Fill October 2026 days (1 to 18 to keep layout clean and tight)
    for (let i = 1; i <= 18; i++) {
      const dayStr = `2026-10-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr: dayStr,
        dayNum: i,
        isSelected: selectedDate === dayStr,
        isCurrentMonth: true
      });
    }

    return days;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h2 className="font-sans text-2xl md:text-3xl font-bold text-blue-950 tracking-tight">Today's Overview</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Real-time visitor logs and reception desk controls.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Meetings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Meetings Today</p>
            <p className="text-3xl font-extrabold text-blue-950 mt-1">{totalTodayCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#00236f] border border-blue-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Checkins */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Check-ins</p>
            <p className="text-3xl font-extrabold text-blue-950 mt-1">{pendingCheckinsCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Active Meetings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Meetings</p>
            <p className="text-3xl font-extrabold text-blue-950 mt-1">{activeMeetingsCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Schedule list (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-base font-bold text-blue-950">
              Schedule ({selectedDate === todayISO ? "Today" : selectedDate})
            </h3>
            
            <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold shadow-sm">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                  filterMode === 'all' ? 'bg-[#00236f] text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('upcoming')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                  filterMode === 'upcoming' ? 'bg-[#00236f] text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="col-span-2">Time</div>
              <div className="col-span-4">Visitor</div>
              <div className="col-span-3">Host</div>
              <div className="col-span-3 text-right">Status / Actions</div>
            </div>

            {/* List entries */}
            <div className="divide-y divide-slate-100">
              {displayedAppointments.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No appointments scheduled for this date.</p>
                </div>
              ) : (
                displayedAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors relative"
                  >
                    {/* Tiny visual status bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                      appt.status === 'Ongoing' || appt.status === 'In Progress' ? 'bg-blue-500' :
                      appt.status === 'Pending' || appt.status === 'Starting Soon' ? 'bg-amber-500' : 'bg-slate-200'
                    }`}></div>

                    {/* Time Column */}
                    <div className="col-span-2 font-bold text-slate-900 text-xs">
                      {appt.startTime}
                    </div>

                    {/* Visitor details Column */}
                    <div className="col-span-4 flex items-center gap-3">
                      {renderVisitorAvatar(appt.visitorName, appt.visitorCompany)}
                      <div className="truncate">
                        {appt.isPrivate ? (
                          <p className="text-xs font-bold text-slate-400 italic">Private Booking</p>
                        ) : (
                          <>
                            <p className="text-xs font-bold text-slate-800 truncate leading-snug">{appt.visitorName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{appt.visitorCompany || 'No Company'}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Host Column */}
                    <div className="col-span-3 text-xs font-semibold text-slate-700 truncate">
                      {appt.hostName}
                    </div>

                    {/* Actions and Badging Column */}
                    <div className="col-span-3 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 text-right">
                      {renderStatusBadge(appt)}
                      
                      {/* Live interaction toggling: Expected -> In Progress -> Completed */}
                      {appt.status !== 'Completed' && appt.status !== 'No-Show' && (
                        <button
                          onClick={() => {
                            const nextStatus = appt.status === 'Expected' || appt.status === 'Pending' || appt.status === 'Starting Soon'
                              ? 'In Progress'
                              : 'Completed';
                            onCheckInToggle(appt.id, nextStatus);
                          }}
                          className="text-[10px] font-bold text-blue-900 hover:text-white border border-blue-200 hover:bg-[#00236f] hover:border-[#00236f] px-2 py-0.5 rounded-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                          title="Advance visitor checklist status"
                        >
                          <Check className="w-2.5 h-2.5" />
                          <span>{appt.status === 'In Progress' ? 'Check-out' : 'Check-in'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Mini Calendar and Activity Feed (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Calendar Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-sans text-sm font-bold text-blue-950">October 2026</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Workspace Live</span>
            </div>

            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {generateCalendarDays().map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    !day.isCurrentMonth
                      ? 'text-slate-300 hover:bg-slate-50'
                      : day.isSelected
                      ? 'bg-[#00236f] text-white shadow-md shadow-blue-900/15'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day.dayNum}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Logs Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex-grow flex flex-col">
            <h4 className="font-sans text-sm font-bold text-blue-950 mb-4">Activity Feed</h4>
            
            <div className="flex flex-col gap-4 flex-grow">
              {activityLogs.slice(0, 4).map((log) => {
                let logIcon = <Check className="w-3.5 h-3.5 text-emerald-600" />;
                let iconBg = 'bg-emerald-50 border-emerald-100';

                if (log.type === 'late') {
                  logIcon = <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
                  iconBg = 'bg-red-50 border-red-100';
                } else if (log.type === 'invite') {
                  logIcon = <Mail className="w-3.5 h-3.5 text-blue-600" />;
                  iconBg = 'bg-blue-50 border-blue-100';
                }

                return (
                  <div key={log.id} className="flex gap-3 text-xs leading-snug">
                    <div className={`w-7 h-7 rounded-full border ${iconBg} flex items-center justify-center shrink-0`}>
                      {logIcon}
                    </div>
                    <div>
                      <p className="text-slate-700">
                        <span className="font-bold text-slate-800">{log.user}</span> {log.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
