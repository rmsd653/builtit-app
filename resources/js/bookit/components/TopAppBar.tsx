import React, { useState } from 'react';
import { Search, Bell, Shield, Clipboard, UserCheck, Menu, LogOut, ChevronDown } from 'lucide-react';
import { DashboardView, Employee } from '../types';

interface TopAppBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dashboardPerspective: DashboardView;
  setDashboardPerspective: (view: DashboardView) => void;
  onOpenMobileMenu?: () => void;
  unreadCount?: number;
  activityLogs: any[];
  currentUser: Employee | null;
  onLogout: () => void;
}

export default function TopAppBar({
  searchQuery,
  setSearchQuery,
  dashboardPerspective,
  setDashboardPerspective,
  unreadCount = 2,
  activityLogs,
  currentUser,
  onLogout
}: TopAppBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPerspectiveDropdown, setShowPerspectiveDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const viewLabels: Record<DashboardView, string> = {
    my_schedule: 'Employee Schedule View',
    receptionist: 'Receptionist Overview',
    manager: 'Manager Performance View'
  };

  const viewIcons: Record<DashboardView, React.ReactNode> = {
    my_schedule: <UserCheck className="w-4 h-4 text-amber-600" />,
    receptionist: <Clipboard className="w-4 h-4 text-blue-600" />,
    manager: <Shield className="w-4 h-4 text-emerald-600" />
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 sticky top-0 z-10 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      {/* Mobile Menu Icon (Visually descriptive but menu is full-desktop sidebar + bottombar) */}
      <div className="flex items-center gap-2 md:hidden text-blue-950 font-bold">
        <Building2Logo className="w-6 h-6 text-[#00236f]" />
        <span>BookIt</span>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00236f] focus:bg-white focus:ring-1 focus:ring-[#00236f] transition-all"
          placeholder="Search visitors, hosts, meetings..."
          type="text"
        />
      </div>

      {/* Action Tray */}
      <div className="flex items-center gap-4 ml-auto relative">
        {/* Dashboard Perspective Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowPerspectiveDropdown(!showPerspectiveDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            id="btn-role-selector"
          >
            {viewIcons[dashboardPerspective]}
            <span>{viewLabels[dashboardPerspective]}</span>
            <span className="text-[9px] text-slate-400 font-bold">▼</span>
          </button>

          {showPerspectiveDropdown && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowPerspectiveDropdown(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-30 animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-1">
                  Switch Dashboard Perspective
                </div>
                
                <button
                  onClick={() => {
                    setDashboardPerspective('my_schedule');
                    setShowPerspectiveDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    dashboardPerspective === 'my_schedule' ? 'text-blue-900 bg-blue-50/50' : 'text-slate-600'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  Employee: My Schedule
                </button>

                <button
                  onClick={() => {
                    setDashboardPerspective('receptionist');
                    setShowPerspectiveDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    dashboardPerspective === 'receptionist' ? 'text-blue-900 bg-blue-50/50' : 'text-slate-600'
                  }`}
                >
                  <Clipboard className="w-4 h-4 text-blue-500" />
                  Receptionist Dashboard
                </button>

                <button
                  onClick={() => {
                    setDashboardPerspective('manager');
                    setShowPerspectiveDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    dashboardPerspective === 'manager' ? 'text-blue-900 bg-blue-50/50' : 'text-slate-600'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Executive Manager Overview
                </button>
              </div>
            </>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

        {/* Notification Feed Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-[#00236f] hover:bg-slate-100 transition-all relative cursor-pointer"
            id="btn-notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-3 px-4 z-30 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-semibold text-sm text-slate-800">Alert Center</h4>
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                    {unreadCount} Alerts
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="text-xs text-slate-600 flex items-start gap-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.type === 'late' ? 'bg-red-500' :
                        log.type === 'invite' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-slate-700">{log.user} {log.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all text-left cursor-pointer select-none border border-transparent hover:border-slate-100"
            id="profile-dropdown-btn"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-[#00236f] text-white flex items-center justify-center font-bold text-[11px]">
              {currentUser?.avatarUrl ? (
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  src={currentUser.avatarUrl}
                />
              ) : (
                <span>{currentUser?.initials || 'SJ'}</span>
              )}
            </div>
            <div className="hidden lg:block text-left mr-1">
              <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.name || 'Sarah Jenkins'}</p>
              <p className="text-[9px] text-slate-400 font-bold leading-none mt-0.5">{currentUser?.role || 'Office Manager'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block shrink-0" />
          </button>

          {showProfileDropdown && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowProfileDropdown(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{currentUser?.name || 'Sarah Jenkins'}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{currentUser?.role || 'Office Manager'}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  id="logout-dropdown-option"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Minimalist corporate icon inline
function Building2Logo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
