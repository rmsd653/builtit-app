import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Search, Plus, User, Info, ArrowLeft, ArrowRight, Lock, Trash2 } from 'lucide-react';
import { Appointment, Employee } from '../types';

interface MeetingsCalendarProps {
  appointments: Appointment[];
  employees: Employee[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenNewAppointment: () => void;
  onDeleteAppointment: (id: string) => void;
}

const HOURS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function MeetingsCalendar({
  appointments,
  employees,
  selectedDate,
  setSelectedDate,
  onOpenNewAppointment,
  onDeleteAppointment
}: MeetingsCalendarProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // Navigate dates
  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
    setSelectedAppt(null);
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split('T')[0]);
    setSelectedAppt(null);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedAppt(null);
  };

  // Filter appointments for active date and search query
  const dayAppointments = appointments.filter((appt) => {
    const matchesDate = appt.date === selectedDate;
    const matchesSearch = localSearch
      ? appt.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        appt.visitorName.toLowerCase().includes(localSearch.toLowerCase()) ||
        appt.hostName.toLowerCase().includes(localSearch.toLowerCase())
      : true;
    return matchesDate && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-blue-950 tracking-tight">Interactive Calendar</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Review, coordinate, and modify office timelines dynamically.</p>
        </div>
        <button
          onClick={onOpenNewAppointment}
          className="bg-[#00236f] hover:bg-blue-900 text-white text-xs font-bold h-10 px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      {/* Timeline Controls & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={handleNextDay}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-800 ml-2">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC' // Prevent timezone drift on rendering ISO strings
            })}
          </span>
        </div>

        {/* Live Search Filter */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00236f] focus:bg-white transition-all text-slate-800"
            placeholder="Filter current view..."
            type="text"
          />
        </div>
      </div>

      {/* Main Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Timeline Timeline Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Roster Timeline
          </div>

          <div className="divide-y divide-slate-100 relative">
            {HOURS.map((hour, idx) => {
              // Find appointments starting during this hour block
              const apptsInHour = dayAppointments.filter((appt) => {
                const startHourStr = appt.startTime.split(':')[0];
                const startAmPm = appt.startTime.split(' ')[1];
                const hourNumStr = hour.split(':')[0];
                const hourAmPm = hour.split(' ')[1];
                return startHourStr === hourNumStr && startAmPm === hourAmPm;
              });

              return (
                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-start min-h-[70px]">
                  {/* Time coordinate */}
                  <div className="col-span-2 text-xs font-bold text-slate-400 select-none">
                    {hour}
                  </div>

                  {/* Appointments coordinate block */}
                  <div className="col-span-10 flex flex-col gap-2">
                    {apptsInHour.length === 0 ? (
                      <span className="text-[11px] text-slate-300 italic select-none mt-0.5">No bookings</span>
                    ) : (
                      apptsInHour.map((appt) => (
                        <div
                          key={appt.id}
                          onClick={() => setSelectedAppt(appt)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all relative pl-3.5 hover:shadow-sm ${
                            selectedAppt?.id === appt.id
                              ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400'
                              : 'bg-slate-50/50 border-slate-150 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {/* Visual border marker */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00236f] rounded-l-lg"></div>

                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                                {appt.title}
                                {appt.isPrivate && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                Host: {appt.hostName} | Visitor: {appt.visitorName}
                              </p>
                            </div>
                            <span className="text-[9px] font-bold bg-[#00236f]/10 text-blue-900 px-1.5 py-0.5 rounded-full">
                              {appt.startTime} - {appt.endTime}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Panel Details Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[300px] flex flex-col">
            <h3 className="font-sans text-sm font-bold text-blue-950 mb-4 border-b border-slate-100 pb-3">
              Appointment Details
            </h3>

            {selectedAppt ? (
              <div className="flex-grow flex flex-col gap-4 text-xs animate-in fade-in duration-150">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00236f] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {selectedAppt.status}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 mt-2 leading-snug">{selectedAppt.title}</h4>
                </div>

                <div className="flex flex-col gap-2.5 border-y border-slate-100 py-3 text-slate-600">
                  <div className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Visitor: {selectedAppt.visitorName} {selectedAppt.visitorCompany ? `(${selectedAppt.visitorCompany})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Time Slot: {selectedAppt.startTime} - {selectedAppt.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Room: {selectedAppt.room}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Host Employee: {selectedAppt.hostName}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="font-bold text-slate-700 uppercase text-[9px] tracking-wider flex items-center gap-1 mb-1">
                    <Info className="w-3.5 h-3.5" /> Agenda Outline
                  </p>
                  <p className="text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                    {selectedAppt.notes || 'No custom planning details or goals registered for this slot.'}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this appointment?')) {
                        onDeleteAppointment(selectedAppt.id);
                        setSelectedAppt(null);
                      }
                    }}
                    className="p-2 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 rounded-lg transition-all active:scale-95 cursor-pointer"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedAppt(null)}
                    className="px-4 py-2 font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <Info className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs font-semibold">Select a booking on the timeline to inspect active details, notes, and actions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
