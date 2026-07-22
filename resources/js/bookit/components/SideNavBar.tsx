import React from 'react';
import { LayoutDashboard, Calendar, BarChart3, Settings, Plus, Building2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface SideNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewAppointment: () => void;
}

export default function SideNavBar({
  activeTab,
  setActiveTab,
  onOpenNewAppointment
}: SideNavBarProps) {
  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-slate-200 z-20 flex flex-col p-4 hidden md:flex">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-sans text-lg font-bold text-blue-950 tracking-tight">BookIt</h1>
            <p className="text-xs text-slate-500 font-medium">Management Portal</p>
          </div>
        </div>

        {/* Create CTA */}
        <button
          onClick={onOpenNewAppointment}
          className="w-full bg-[#00236f] hover:bg-blue-900 text-white font-semibold text-[13px] h-10 rounded-lg mb-6 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          id="btn-sidebar-new-appt"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>

        {/* Navigation Items */}
        <nav className="flex-grow flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[13px] tracking-wide active:scale-[0.98] transition-all text-left cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-[#00236f] bg-blue-50'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className={`w-[18px] h-[18px] ${activeTab === 'dashboard' ? 'text-[#00236f]' : 'text-slate-400'}`} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[13px] tracking-wide active:scale-[0.98] transition-all text-left cursor-pointer ${
              activeTab === 'meetings'
                ? 'text-[#00236f] bg-blue-50'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Calendar className={`w-[18px] h-[18px] ${activeTab === 'meetings' ? 'text-[#00236f]' : 'text-slate-400'}`} />
            Meetings
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[13px] tracking-wide active:scale-[0.98] transition-all text-left cursor-pointer ${
              activeTab === 'reports'
                ? 'text-[#00236f] bg-blue-50'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <BarChart3 className={`w-[18px] h-[18px] ${activeTab === 'reports' ? 'text-[#00236f]' : 'text-slate-400'}`} />
            Reports
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[13px] tracking-wide active:scale-[0.98] transition-all mt-auto text-left cursor-pointer ${
              activeTab === 'settings'
                ? 'text-[#00236f] bg-blue-50'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Settings className={`w-[18px] h-[18px] ${activeTab === 'settings' ? 'text-[#00236f]' : 'text-slate-400'}`} />
            Settings
          </button>
        </nav>
      </aside>

      {/* Sticky Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 flex justify-around p-2 md:hidden">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
            activeTab === 'dashboard' ? 'text-[#00236f]' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>
        
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
            activeTab === 'meetings' ? 'text-[#00236f]' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold">Meetings</span>
        </button>

        <button
          onClick={onOpenNewAppointment}
          className="flex flex-col items-center justify-center -mt-6 bg-[#00236f] hover:bg-blue-900 text-white w-12 h-12 rounded-full shadow-lg border-4 border-slate-50"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
            activeTab === 'reports' ? 'text-[#00236f]' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
            activeTab === 'settings' ? 'text-[#00236f]' : 'text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </>
  );
}
