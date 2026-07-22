import React, { useState } from 'react';
import { Clock, MapPin, Lock, ChevronRight, CheckCircle2, AlertTriangle, Calendar, Info } from 'lucide-react';
import { Appointment } from '../types';

interface DashboardMyScheduleProps {
  appointments: Appointment[];
  onLockTimeToggle: () => void;
  isTimeLocked: boolean;
  onNavigateToCalendar: () => void;
}

export default function DashboardMySchedule({
  appointments,
  onLockTimeToggle,
  isTimeLocked,
  onNavigateToCalendar
}: DashboardMyScheduleProps) {
  const [selectedAgendaAppt, setSelectedAgendaAppt] = useState<Appointment | null>(null);

  // Filter today's meetings for employee Sarah Jenkins (emp-1 or matching host)
  // Let's filter today's appointments (non-private or owned by employee)
  const todayISO = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(appt => appt.date === todayISO);
  
  // In the mockup, there are 2 main meetings on Sarah's main schedule:
  // "Annual Review - Design Team" and "Vendor Pitch: Global Logistics".
  // Let's grab these or fallback to any of today's non-private meetings
  const myScheduleToday = todayAppointments.slice(0, 3);

  // Future meetings (relative offsets > 0)
  const upcomingMeetings = appointments
    .filter(appt => appt.date > todayISO)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Ongoing':
      case 'In Progress':
        return 'bg-blue-500';
      case 'Pending':
      case 'Starting Soon':
        return 'bg-amber-500';
      case 'Completed':
        return 'bg-emerald-500';
      case 'No-Show':
        return 'bg-rose-500';
      default:
        return 'bg-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-blue-950 tracking-tight">My Schedule</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Welcome back, Sarah. Here's your day at a glance.</p>
        </div>
        <button
          onClick={onLockTimeToggle}
          className={`h-10 px-4 border rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
            isTimeLocked
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-lock-time"
        >
          <Lock className={`w-3.5 h-3.5 ${isTimeLocked ? 'fill-amber-600' : ''}`} />
          <span>{isTimeLocked ? 'Unlock Time' : 'Lock Time'}</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Meetings (Left Side) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
              <h3 className="font-sans text-base font-bold text-blue-950">Today's Meetings</h3>
              <span className="text-[11px] font-bold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-full">
                {myScheduleToday.length} Remaining
              </span>
            </div>

            {myScheduleToday.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No meetings scheduled for today.</p>
                <p className="text-xs">Schedule an appointment or enjoy some focus time!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {myScheduleToday.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all relative overflow-hidden group"
                  >
                    {/* Status side bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(appt.status)}`}></div>
                    
                    <div className="flex-1 pl-2">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[14px] text-slate-900 leading-snug">{appt.title}</p>
                            {appt.isPrivate && (
                              <span className="flex items-center gap-1 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                <Lock className="w-2.5 h-2.5" />
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Visitor: {appt.visitorName} {appt.visitorCompany && `(${appt.visitorCompany})`}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          appt.status === 'Ongoing' || appt.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700 animate-pulse'
                            : appt.status === 'Pending' || appt.status === 'Starting Soon'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>

                      {/* Time and Room metadata */}
                      <div className="flex items-center gap-4 text-slate-500 text-[11px] font-semibold mt-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {appt.startTime} - {appt.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {appt.room}
                        </span>
                      </div>
                    </div>

                    {/* Button trigger */}
                    <button
                      onClick={() => setSelectedAgendaAppt(appt)}
                      className="sm:mt-0 mt-3 h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-blue-900 hover:border-blue-900 bg-white transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      View Agenda
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agenda Popover Modal details */}
          {selectedAgendaAppt && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#00236f]" />
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Meeting Details &amp; Notes
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedAgendaAppt(null)}
                  className="text-xs font-bold text-[#00236f] hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-snug">{selectedAgendaAppt.title}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Host: {selectedAgendaAppt.hostName}</p>
              <div className="mt-3 text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-lg p-3">
                {selectedAgendaAppt.notes || 'No custom agenda details provided. Complete prep work before meeting start.'}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Performance & Upcoming) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Performance Widget (Screen 1 style) */}
          <div className="bg-[#00236f] text-white rounded-xl p-6 relative overflow-hidden shadow-[0_4px_25px_rgba(0,35,111,0.15)]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2">Meetings Handled</h3>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-extrabold tracking-tight">42</span>
              <span className="text-xs text-blue-200/80 font-semibold pb-1">this week</span>
            </div>
            
            {/* Target goal indicator bar */}
            <div className="w-full bg-black/20 h-2 rounded-full mt-4">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] font-semibold text-blue-200 mt-2">75% of weekly goal (56)</p>
          </div>

          {/* Upcoming List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex-grow flex flex-col">
            <h3 className="font-sans text-base font-bold text-blue-950 mb-4">Upcoming (Next 3)</h3>
            
            <div className="flex flex-col gap-1 flex-grow">
              {upcomingMeetings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
                  <p className="text-xs font-semibold">No upcoming meetings scheduled.</p>
                </div>
              ) : (
                upcomingMeetings.map((appt) => {
                  // Format date to friendly (e.g. "Tomorrow")
                  const isTomorrow = appt.date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                  const friendlyDate = isTomorrow ? 'Tomorrow' : 'Later this week';

                  return (
                    <div
                      key={appt.id}
                      onClick={onNavigateToCalendar}
                      className="py-3 px-2 flex justify-between items-center group cursor-pointer hover:bg-slate-50 -mx-2 rounded-lg transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-800 group-hover:text-blue-900 transition-colors">
                          {appt.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {friendlyDate}, {appt.startTime}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-900 transition-colors" />
                    </div>
                  );
                })
              )}
            </div>
            
            <button
              onClick={onNavigateToCalendar}
              className="w-full mt-4 text-center text-[#00236f] hover:text-blue-900 font-bold text-[12px] tracking-wide hover:underline cursor-pointer"
            >
              View Full Calendar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
