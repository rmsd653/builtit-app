import React, { useState } from 'react';
import { X, Calendar, User, Building, MapPin, Clock, Lock, FileText } from 'lucide-react';
import { Employee, Appointment } from '../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onAddAppointment: (appointment: Appointment) => void;
}

const MEETING_ROOMS = [
  'Conference Room A',
  'Room 402',
  'Boardroom A',
  'Meeting Room 3',
  'Office 2',
  'Room 102',
  'Room 301',
  'Board Room A'
];

const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

export default function NewAppointmentModal({
  isOpen,
  onClose,
  employees,
  onAddAppointment
}: NewAppointmentModalProps) {
  const [title, setTitle] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorCompany, setVisitorCompany] = useState('');
  const [hostId, setHostId] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [room, setRoom] = useState('Conference Room A');
  const [isPrivate, setIsPrivate] = useState(false);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!visitorName.trim()) newErrors.visitorName = 'Visitor name is required';
    if (!hostId) newErrors.hostId = 'Host employee is required';
    if (!date) newErrors.date = 'Meeting date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const hostEmployee = employees.find((emp) => emp.id === hostId);

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      title: title.trim(),
      visitorName: visitorName.trim(),
      visitorCompany: visitorCompany.trim() || undefined,
      hostId,
      hostName: hostEmployee ? hostEmployee.name : 'Unknown Host',
      startTime,
      endTime,
      room,
      status: 'Pending',
      date,
      isPrivate,
      notes: notes.trim() || undefined
    };

    onAddAppointment(newAppointment);
    
    // Reset form
    setTitle('');
    setVisitorName('');
    setVisitorCompany('');
    setHostId('');
    setIsPrivate(false);
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        id="modal-new-appointment"
      >
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-900">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-950 font-sans tracking-tight">New Appointment</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
          
          {/* Meeting Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Meeting Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="e.g. Design Sync / Client Pitch"
              className={`w-full text-sm border px-3 py-2 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all ${
                errors.title ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
              }`}
              type="text"
              id="input-title"
            />
            {errors.title && <p className="text-[10px] text-red-500 font-semibold">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Visitor Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Visitor Name <span className="text-red-500">*</span>
              </label>
              <input
                value={visitorName}
                onChange={(e) => {
                  setVisitorName(e.target.value);
                  if (errors.visitorName) setErrors({ ...errors, visitorName: '' });
                }}
                placeholder="John Doe"
                className={`w-full text-sm border px-3 py-2 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all ${
                  errors.visitorName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
                type="text"
                id="input-visitor-name"
              />
              {errors.visitorName && <p className="text-[10px] text-red-500 font-semibold">{errors.visitorName}</p>}
            </div>

            {/* Visitor Company */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Visitor Company
              </label>
              <input
                value={visitorCompany}
                onChange={(e) => setVisitorCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full text-sm border border-slate-200 px-3 py-2 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
                type="text"
                id="input-visitor-company"
              />
            </div>
          </div>

          {/* Host Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Host Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={hostId}
              onChange={(e) => {
                setHostId(e.target.value);
                if (errors.hostId) setErrors({ ...errors, hostId: '' });
              }}
              className={`w-full text-sm border px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all cursor-pointer ${
                errors.hostId ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
              }`}
              id="select-host"
            >
              <option value="">Select Host Employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
            {errors.hostId && <p className="text-[10px] text-red-500 font-semibold">{errors.hostId}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Meeting Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Meeting Date <span className="text-red-500">*</span>
              </label>
              <input
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors({ ...errors, date: '' });
                }}
                className={`w-full text-sm border px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all cursor-pointer ${
                  errors.date ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
                type="date"
                id="input-date"
              />
              {errors.date && <p className="text-[10px] text-red-500 font-semibold">{errors.date}</p>}
            </div>

            {/* Meeting Room */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Meeting Room
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full text-sm border border-slate-200 px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all cursor-pointer"
                id="select-room"
              >
                {MEETING_ROOMS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm border border-slate-200 px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all cursor-pointer"
                id="select-start-time"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm border border-slate-200 px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all cursor-pointer"
                id="select-end-time"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Private Booking Toggle */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3 mt-1">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#00236f] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Private Appointment</p>
                <p className="text-[10px] text-slate-400 font-medium">Hide meeting details from general reception lists</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isPrivate} 
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
                id="checkbox-private"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00236f]"></div>
            </label>
          </div>

          {/* Agenda Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Agenda / Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe meeting goals, preparation checklist, or visitor instructions..."
              className="w-full text-sm border border-slate-200 px-3 py-2 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all min-h-[70px] resize-none"
              id="textarea-notes"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#00236f] hover:bg-blue-900 text-white rounded-lg active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              id="btn-submit-appointment"
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
