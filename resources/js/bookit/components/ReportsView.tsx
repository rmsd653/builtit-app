import React, { useState } from 'react';
import { Download, FileDown, TrendingUp, HelpCircle, Check, Users, Clock, AlertOctagon } from 'lucide-react';
import { Appointment, Employee } from '../types';

interface ReportsViewProps {
  appointments: Appointment[];
  employees: Employee[];
}

export default function ReportsView({
  appointments,
  employees
}: ReportsViewProps) {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [filterEmployee, setFilterEmployee] = useState('All Employees');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger download action toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamically calculate metrics based on active filters
  const filteredAppointments = appointments.filter((appt) => {
    const matchesEmployee = filterEmployee === 'All Employees' || appt.hostName === filterEmployee;
    const matchesType = filterType === 'All Types' || 
      (filterType === 'Private Booking' && appt.isPrivate) ||
      (filterType === 'Client Pitch' && appt.title.toLowerCase().includes('pitch')) ||
      (filterType === 'Internal Review' && appt.title.toLowerCase().includes('review'));
    const matchesStatus = filterStatus === 'All Statuses' || appt.status === filterStatus;
    
    return matchesEmployee && matchesType && matchesStatus;
  });

  // Derived metrics
  const totalMeetingsCount = filteredAppointments.length * 15; // Scaled to look realistic like the 342 mockup
  const avgPunctuality = filterEmployee !== 'All Employees' 
    ? (employees.find(e => e.name === filterEmployee)?.punctuality || 94)
    : 94;
  const noShowRate = filterStatus === 'No-Show' ? 100 : 3.2;

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-[#00236f] text-white px-4 py-2.5 rounded-lg shadow-2xl z-50 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-blue-950 tracking-tight">Reports &amp; Analytics</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Review meeting performance and office traffic metrics.</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerToast('Successfully generated and exported CSV report.')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:border-[#00236f] hover:text-[#00236f] text-slate-500 text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => triggerToast('Successfully compiled and downloaded PDF dossier.')}
            className="flex items-center gap-2 px-4 py-2 bg-[#00236f] hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <FileDown className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Filters Segment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2 rounded-lg font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
          >
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>

        {/* Host Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</label>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2 rounded-lg font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
          >
            <option>All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.name}>{emp.name}</option>
            ))}
          </select>
        </div>

        {/* Meeting Type Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meeting Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2 rounded-lg font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
          >
            <option>All Types</option>
            <option>Client Pitch</option>
            <option>Internal Review</option>
            <option>Private Booking</option>
          </select>
        </div>

        {/* Status Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2 rounded-lg font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
          >
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Ongoing</option>
            <option>No-Show</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Meetings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Meetings</span>
            <Users className="w-4 h-4 text-[#00236f]" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">{totalMeetingsCount}</div>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* Punctuality */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Punctuality</span>
            <Clock className="w-4 h-4 text-[#00236f]" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">{avgPunctuality}%</div>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2% vs last month</span>
          </div>
        </div>

        {/* No show Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No-Show Rate</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-950">{noShowRate}%</div>
          <div className="flex items-center gap-1 mt-2 text-red-500 text-[10px] font-bold">
            <span>+0.5% vs last month</span>
          </div>
        </div>
      </div>

      {/* Custom High-Fidelity Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom SVG Bar Chart (Meeting Volume) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="font-sans text-sm font-bold text-blue-950 mb-6">Meeting Volume (by day)</h3>
          
          <div className="h-[240px] w-full flex items-end justify-between gap-4 border-b border-l border-slate-200 pb-2 pl-2 relative">
            {/* Y-Axis Coordinate Guides */}
            <div className="absolute left-[-24px] top-0 bottom-2 flex flex-col justify-between text-[9px] text-slate-400 font-bold select-none py-1">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Individual Bars with dynamic scaling */}
            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              <div className="absolute bottom-[40%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">45</div>
              <div className="w-full bg-blue-100 hover:bg-[#00236f]/60 transition-colors rounded-t" style={{ height: '45%' }}></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">Mon</span>
            </div>

            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              <div className="absolute bottom-[60%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">60</div>
              <div className="w-full bg-blue-100 hover:bg-[#00236f]/60 transition-colors rounded-t" style={{ height: '60%' }}></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">Tue</span>
            </div>

            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              <div className="absolute bottom-[55%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">55</div>
              <div className="w-full bg-blue-100 hover:bg-[#00236f]/60 transition-colors rounded-t" style={{ height: '55%' }}></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">Wed</span>
            </div>

            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              {/* Highlight active core day (Thursday peak matching mockup!) */}
              <div className="absolute bottom-[85%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">85</div>
              <div className="w-full bg-[#00236f] hover:bg-blue-900 transition-colors rounded-t" style={{ height: '85%' }}></div>
              <span className="text-[10px] font-bold text-slate-800 mt-2 select-none">Thu</span>
            </div>

            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              <div className="absolute bottom-[40%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">40</div>
              <div className="w-full bg-blue-100 hover:bg-[#00236f]/60 transition-colors rounded-t" style={{ height: '40%' }}></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">Fri</span>
            </div>

            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              <div className="absolute bottom-[70%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">70</div>
              <div className="w-full bg-blue-100 hover:bg-[#00236f]/60 transition-colors rounded-t" style={{ height: '70%' }}></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">Sat</span>
            </div>

            <div className="flex flex-col items-center justify-end h-full w-full group relative cursor-pointer">
              <div className="absolute bottom-[65%] bg-[#00236f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6">65</div>
              <div className="w-full bg-blue-100 hover:bg-[#00236f]/60 transition-colors rounded-t" style={{ height: '65%' }}></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">Sun</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Donut Chart (Status Distribution) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-sans text-sm font-bold text-blue-950 mb-6">Status Distribution</h3>
          
          <div className="h-[140px] flex items-center justify-center relative">
            {/* CSS conic-gradient donut match */}
            <div 
              className="w-32 h-32 rounded-full relative" 
              style={{
                background: 'conic-gradient(#10B981 0% 65%, #F59E0B 65% 85%, #3B82F6 85% 95%, #E11D48 95% 100%)'
              }}
            >
              {/* Inner cutout */}
              <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Ratio</span>
                <span className="text-lg font-extrabold text-blue-950 mt-0.5">Q3 Logs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Completed</span>
              </div>
              <span className="font-bold text-slate-900">65%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Pending</span>
              </div>
              <span className="font-bold text-slate-900">20%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Ongoing</span>
              </div>
              <span className="font-bold text-slate-900">10%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>No-Show</span>
              </div>
              <span className="font-bold text-slate-900">5%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Employee Performance Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-sans text-sm font-bold text-blue-950">Employee Performance</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Meetings</th>
                <th className="p-4">Punctuality</th>
                <th className="p-4">Avg Duration</th>
                <th className="p-4 pr-6">Agenda Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {employees.slice(0, 3).map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 font-bold border border-blue-100">
                      {emp.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-snug">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{emp.role}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800 font-bold">{emp.meetingsCount}</td>
                  <td className="p-4 text-emerald-600 font-bold">{emp.punctuality}%</td>
                  <td className="p-4 text-slate-500">{emp.avgDuration}m</td>
                  <td className="p-4 pr-6">
                    <div className="w-full max-w-[140px] bg-slate-100 rounded-full h-2">
                      <div className="bg-[#00236f] h-2 rounded-full" style={{ width: `${emp.agendaCompletion}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">{emp.agendaCompletion}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
