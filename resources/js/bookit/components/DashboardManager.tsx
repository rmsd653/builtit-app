import React, { useState } from 'react';
import { Users, CheckCircle2, AlertTriangle, PieChart, Shield, User, MapPin, RefreshCw, MoreVertical, Check, X } from 'lucide-react';
import { Appointment, Employee } from '../types';

interface DashboardManagerProps {
  appointments: Appointment[];
  employees: Employee[];
  onReassignMeeting: (apptId: string, newHostId: string) => void;
}

export default function DashboardManager({
  appointments,
  employees,
  onReassignMeeting
}: DashboardManagerProps) {
  const [timeMode, setTimeMode] = useState<'today' | 'week'>('today');
  const [activeTab, setActiveTab] = useState<'my_meetings' | 'team_overview'>('my_meetings');
  const [reassigningApptId, setReassigningApptId] = useState<string | null>(null);

  // Filter today's meetings
  const todayISO = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((appt) => appt.date === todayISO);

  // Stat metrics values
  const totalTodayCount = todayAppointments.length;
  const completedTodayCount = todayAppointments.filter((appt) => appt.status === 'Completed').length;
  const noshowsCount = todayAppointments.filter((appt) => appt.status === 'No-Show').length;

  // Render employee status indicators
  const getStatusIndicatorColor = (status: Employee['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500';
      case 'In Meeting':
      case 'Busy':
        return 'bg-blue-500';
      case 'Offline':
      case 'OOO':
        return 'bg-slate-400';
      default:
        return 'bg-slate-300';
    }
  };

  // Meetings owned by Sarah Jenkins or matching standard manager host
  const managerMeetings = todayAppointments.filter(appt => 
    appt.hostName.includes('Sarah') || appt.hostId === 'emp-1' || appt.isPrivate
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-blue-950 tracking-tight font-headline-lg">Overview</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Today's schedule and team performance.</p>
        </div>

        {/* Dynamic switcher */}
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 text-xs font-semibold shadow-sm">
          <button
            onClick={() => setTimeMode('today')}
            className={`px-4 py-1.5 rounded-md cursor-pointer transition-all ${
              timeMode === 'today' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeMode('week')}
            className={`px-4 py-1.5 rounded-md cursor-pointer transition-all ${
              timeMode === 'week' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Meetings</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">{totalTodayCount}</div>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
            <span>+12% vs yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">{completedTodayCount || 18}</div>
          <div className="mt-2 text-slate-400 text-[10px] font-bold">
            <span>42% completion rate</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No-Shows</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">{noshowsCount || 3}</div>
          <div className="mt-2 flex items-center gap-1 text-red-500 text-[10px] font-bold">
            <span>Requires attention</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Utilization</span>
            <PieChart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">78%</div>
          <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Meeting Lists (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 px-2 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('my_meetings')}
                className={`px-6 py-4 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                  activeTab === 'my_meetings'
                    ? 'text-[#00236f] border-[#00236f]'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                My Meetings
              </button>
              <button
                onClick={() => setActiveTab('team_overview')}
                className={`px-6 py-4 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                  activeTab === 'team_overview'
                    ? 'text-[#00236f] border-[#00236f]'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                Team Overview ({todayAppointments.length})
              </button>
            </div>

            {/* List Content */}
            <div className="p-2 flex flex-col gap-1 max-h-[500px] overflow-y-auto">
              {activeTab === 'my_meetings' ? (
                managerMeetings.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-xs font-semibold">No direct meetings scheduled for today.</p>
                  </div>
                ) : (
                  managerMeetings.map((appt) => (
                    <div
                      key={appt.id}
                      className="relative bg-white border border-transparent hover:border-slate-200 hover:bg-slate-50/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group"
                    >
                      {/* Status indicator line */}
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full"></div>
                      
                      <div className="flex flex-1 gap-4 items-start pl-2">
                        <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] text-center border-r border-slate-100 pr-3">
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {appt.startTime.split(' ')[0]}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">
                            {appt.startTime.split(' ')[1]}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-900 transition-colors leading-snug">
                              {appt.title}
                            </h4>
                            {appt.isPrivate && (
                              <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500">
                                <Lock className="w-2.5 h-2.5" />
                                Private
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-300" />
                              Host: {appt.hostName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-300" />
                              {appt.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Reassign Action */}
                      <div className="flex items-center gap-2">
                        {reassigningApptId === appt.id ? (
                          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200 animate-in fade-in duration-150">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  onReassignMeeting(appt.id, e.target.value);
                                  setReassigningApptId(null);
                                }
                              }}
                              className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-900 font-bold"
                            >
                              <option value="">Reassign host...</option>
                              {employees
                                .filter((emp) => emp.id !== appt.hostId)
                                .map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={() => setReassigningApptId(null)}
                              className="text-slate-400 hover:text-slate-600 p-1 bg-white border border-slate-200 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReassigningApptId(appt.id)}
                            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-blue-900 hover:border-blue-900 bg-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                            title="Reassign to another direct report"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Reassign
                          </button>
                        )}
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                todayAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="relative bg-white hover:bg-slate-50 rounded-lg p-4 flex justify-between items-center border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-800">{appt.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Host: {appt.hostName} | Visitor: {appt.visitorName}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {appt.startTime}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* View Full Schedule footer action */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <span className="text-xs font-semibold text-slate-400">Showing today's roster. Updates live with reception logs.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Reports Tracker (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-sans text-sm font-bold text-blue-950">Direct Reports</h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded-full">
                Active Staff
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {employees.slice(0, 5).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {emp.avatarUrl ? (
                        <img
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          src={emp.avatarUrl}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {emp.initials}
                        </div>
                      )}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${getStatusIndicatorColor(emp.status)}`}></div>
                    </div>

                    <div>
                      <p className="font-bold text-xs text-slate-800">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">
                        {emp.status} {emp.statusDetails ? `(${emp.statusDetails})` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline lock icon
function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
