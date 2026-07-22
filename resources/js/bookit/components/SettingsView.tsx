import React, { useState } from 'react';
import { Settings, Clock, Check, Bell, Shield, User, Plus, Trash2 } from 'lucide-react';
import { OfficeSettings, Employee } from '../types';

interface SettingsViewProps {
  settings: OfficeSettings;
  onUpdateSettings: (newSettings: OfficeSettings) => void;
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  employees,
  onAddEmployee,
  onDeleteEmployee
}: SettingsViewProps) {
  // New employee form state
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empStatus, setEmpStatus] = useState<Employee['status']>('Available');
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateHours = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const start = data.get('start') as string;
    const end = data.get('end') as string;

    onUpdateSettings({
      ...settings,
      workingHoursStart: start,
      workingHoursEnd: end
    });
    triggerToast('Working hours updated successfully.');
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empRole.trim()) {
      alert('Please fill out all employee fields.');
      return;
    }

    const initials = empName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: empName.trim(),
      role: empRole.trim(),
      initials,
      status: empStatus,
      meetingsCount: 0,
      punctuality: 100,
      avgDuration: 45,
      agendaCompletion: 100
    };

    onAddEmployee(newEmp);
    setEmpName('');
    setEmpRole('');
    setEmpStatus('Available');
    triggerToast(`Successfully registered ${newEmp.name} in staff records.`);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 bg-[#00236f] text-white px-4 py-2.5 rounded-lg shadow-2xl z-50 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h2 className="font-sans text-2xl md:text-3xl font-bold text-blue-950 tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Configure workspace rules, hours, and direct employee rosters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Roster Management) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Employee Directory Management */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-sans text-sm font-bold text-blue-950">Staff &amp; Direct Reports Directory</h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-full">
                {employees.length} Records
              </span>
            </div>

            {/* Existing roster checklist */}
            <div className="p-4 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-950 font-bold flex items-center justify-center text-xs">
                      {emp.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{emp.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700">
                      {emp.status}
                    </span>
                    
                    {/* Safeguard crucial seed employees from arbitrary delete */}
                    {emp.id !== 'emp-1' && emp.id !== 'emp-2' && emp.id !== 'emp-3' && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${emp.name} from directory?`)) {
                            onDeleteEmployee(emp.id);
                            triggerToast('Staff record removed.');
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded-md"
                        title="Remove staff member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Employee Form */}
            <div className="bg-slate-50/50 border-t border-slate-200 p-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00236f]" /> Add New Employee
              </h4>

              <form onSubmit={handleAddEmployeeSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="e.g. David Lee"
                    className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Role</label>
                  <input
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    placeholder="e.g. Account Lead"
                    className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initial Status</label>
                  <select
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value as Employee['status'])}
                    className="w-full text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] cursor-pointer transition-all"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="In Meeting">In Meeting</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-3 flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-[#00236f] hover:bg-blue-900 text-white rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Register Employee
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Right Column (Hours & General Configuration) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Business Hours */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-sans text-sm font-bold text-blue-950 mb-4 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00236f]" />
              Roster Working Hours
            </h3>

            <form onSubmit={handleUpdateHours} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Time</label>
                  <input
                    name="start"
                    defaultValue={settings.workingHoursStart}
                    placeholder="08:00 AM"
                    className="w-full text-xs border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-[#00236f]"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Time</label>
                  <input
                    name="end"
                    defaultValue={settings.workingHoursEnd}
                    placeholder="06:00 PM"
                    className="w-full text-xs border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-[#00236f]"
                    type="text"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00236f] hover:bg-blue-900 text-white font-bold text-xs rounded-lg active:scale-95 transition-all cursor-pointer"
              >
                Apply Hours
              </button>
            </form>
          </div>

          {/* Workflow Toggles */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-sans text-sm font-bold text-blue-950 mb-4 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#00236f]" />
              Rule Presets
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-800">Auto-Checkout Visitors</p>
                  <p className="text-[9px] text-slate-400 font-medium">Checkout visitors automatically at 6:00 PM</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoCheckout}
                  onChange={(e) => onUpdateSettings({ ...settings, autoCheckout: e.target.checked })}
                  className="rounded text-[#00236f] focus:ring-[#00236f] border-slate-300 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-800">Late Warning Alerts</p>
                  <p className="text-[9px] text-slate-400 font-medium">Trigger warning if expected visitor is late 30m</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnLate}
                  onChange={(e) => onUpdateSettings({ ...settings, notifyOnLate: e.target.checked })}
                  className="rounded text-[#00236f] focus:ring-[#00236f] border-slate-300 cursor-pointer"
                />
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
