import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Calendar, Bell, UserCheck, GraduationCap, MapPin } from 'lucide-react';
import { ActiveUser } from '../services/storageService';
import { UniversityLogo } from './UniversityLogo';

interface NavbarProps {
  activeUser: ActiveUser;
  onSwitchRole: () => void;
  onOpenCalendar: () => void;
  onOpenAI: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  onSwitchRole,
  onOpenCalendar,
  onOpenAI,
  onOpenNotifications,
  unreadCount,
  activeTab,
  onSelectTab
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Topmost utility banner */}
      <div className="bg-[#0b1742] text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-amber-600/30">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-semibold tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            Sapthagiri NPS University — School of Engineering & Technology (SoET)
          </span>
          <span className="hidden md:inline text-slate-300">·</span>
          <span className="hidden md:inline text-slate-300">AY 2026-2027 ODD Semester</span>
          <span className="hidden lg:inline text-slate-300">·</span>
          <span className="hidden lg:inline text-slate-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            Hesaraghatta Main Rd, Bengaluru - 560057
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="font-mono text-amber-300 font-medium tabular-nums">{currentTime}</span>
          <a
            href="https://snpsu.edu.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 font-semibold"
          >
            snpsu.edu.in
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Area */}
        <div className="flex items-center gap-3.5">
          <UniversityLogo variant="full" size="md" />
        </div>

        {/* Center Nav / Quick Access */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-[#0c1b4f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'attendance'
                ? 'bg-white text-[#0c1b4f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendance Sheet
          </button>
          <button
            onClick={() => onSelectTab('timetable')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'timetable'
                ? 'bg-white text-[#0c1b4f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Timetable
          </button>
          <button
            onClick={() => onSelectTab('campus')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'campus'
                ? 'bg-white text-[#0c1b4f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Campus Tour
          </button>
        </div>

        {/* Actions Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Digital Calendar Trigger */}
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0c1b4f] hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Digital Academic Calendar & CoE 2026-27"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">CoE Events</span>
          </button>

          {/* Saptha AI Assistant */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-all shadow-xs"
            title="Saptha AI Voice & Text Campus Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
            <span>Saptha AI ✦</span>
          </button>

          {/* Notifications bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="View Student Attendance Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={onSwitchRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeUser.role === 'teacher'
                ? 'bg-indigo-900 text-white border-indigo-700 hover:bg-indigo-800'
                : 'bg-[#0c1b4f] text-white border-blue-900 hover:bg-blue-900'
            }`}
          >
            {activeUser.role === 'teacher' ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">Faculty:</span>
                <span className="font-bold truncate max-w-[90px]">{activeUser.teacherName || 'Vikram N R'}</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">Student:</span>
                <span className="font-bold">5CSE01</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
